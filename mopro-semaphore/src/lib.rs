mopro_ffi::app!();

use ark_ec::AffineRepr;
use ark_ff::PrimeField;
use blake512_hash::{Blake512, Digest};
use circom_prover::prover::{CircomProof, ProofLib};
use circom_prover::witness::WitnessFn;
use circom_prover::CircomProver;
use light_poseidon::{Poseidon, PoseidonHasher};
use num_bigint::BigUint;
use serde::{Deserialize, Serialize};

mod witness {
    rust_witness::witness!(semaphore20);
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "uniffi", derive(uniffi::Record))]
pub struct SemaphoreProofResult {

    pub proof_json: String,
    ///
    /// Groth16 proof points
    pub proof_points: Vec<String>,
    pub public_inputs: Vec<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[cfg_attr(feature = "uniffi", derive(uniffi::Record))]
pub struct SemaphoreIdentity {

    pub secret_decimal: String,
    pub commitment_decimal: String,
}

#[derive(Debug, thiserror::Error)]
#[cfg_attr(feature = "uniffi", derive(uniffi::Error))]
#[cfg_attr(feature = "uniffi", uniffi(flat_error))]
pub enum SemaphoreMoproError {
    #[error("invalid Semaphore inputs: {message}")]
    InvalidInputs { message: String },
    #[error("failed to serialize or parse JSON: {message}")]
    Json { message: String },
    #[error("Mopro Semaphore proof operation failed: {message}")]
    Proof { message: String },
}

impl SemaphoreMoproError {
    fn invalid_inputs(message: impl Into<String>) -> Self {
        Self::InvalidInputs {
            message: message.into(),
        }
    }

    fn json(error: impl std::fmt::Display) -> Self {
        Self::Json {
            message: error.to_string(),
        }
    }

    fn proof(error: impl std::fmt::Display) -> Self {
        Self::Proof {
            message: error.to_string(),
        }
    }
}

#[derive(Debug, Serialize)]
struct Semaphore20WitnessInputs {
    secret: Vec<String>,
    #[serde(rename = "merkleProofLength")]
    merkle_proof_length: Vec<String>,
    #[serde(rename = "merkleProofIndex")]
    merkle_proof_index: Vec<String>,
    #[serde(rename = "merkleProofSiblings")]
    merkle_proof_siblings: Vec<String>,
    message: Vec<String>,
    scope: Vec<String>,
}

#[cfg_attr(feature = "uniffi", uniffi::export)]
pub fn build_semaphore20_inputs_json(
    secret: String,
    merkle_proof_length: String,
    merkle_proof_index: String,
    merkle_proof_siblings: Vec<String>,
    message: String,
    scope: String,
) -> Result<String, SemaphoreMoproError> {
    validate_decimal("secret", &secret)?;
    validate_decimal("merkleProofLength", &merkle_proof_length)?;
    validate_decimal("merkleProofIndex", &merkle_proof_index)?;
    validate_decimal("message", &message)?;
    validate_decimal("scope", &scope)?;

    if merkle_proof_siblings.len() != 20 {
        return Err(SemaphoreMoproError::invalid_inputs(format!(
            "Semaphore-20 requires exactly 20 Merkle siblings, got {}",
            merkle_proof_siblings.len()
        )));
    }

    for (index, sibling) in merkle_proof_siblings.iter().enumerate() {
        validate_decimal(&format!("merkleProofSiblings[{index}]"), sibling)?;
    }

    let inputs = Semaphore20WitnessInputs {
        secret: vec![secret],
        merkle_proof_length: vec![merkle_proof_length],
        merkle_proof_index: vec![merkle_proof_index],
        merkle_proof_siblings,
        message: vec![message],
        scope: vec![scope],
    };

    serde_json::to_string(&inputs).map_err(SemaphoreMoproError::json)
}

#[cfg_attr(feature = "uniffi", uniffi::export)]
pub fn prove_semaphore20(
    zkey_path: String,
    circuit_inputs_json: String,
) -> Result<SemaphoreProofResult, SemaphoreMoproError> {
    let proof = prove_semaphore20_inner(zkey_path, circuit_inputs_json)?;
    semaphore_proof_result(proof)
}

#[cfg_attr(feature = "uniffi", uniffi::export)]
pub fn verify_semaphore20(
    zkey_path: String,
    proof_json: String,
) -> Result<bool, SemaphoreMoproError> {
    let proof: CircomProof =
    serde_json::from_str(&proof_json).map_err(SemaphoreMoproError::json)?;

    CircomProver::verify(ProofLib::Arkworks, proof, zkey_path).map_err(SemaphoreMoproError::proof)
}

/// Derive a Semaphore-v4 identity from a private-key seed.
/// `seed` is treated as raw bytes (matching `Buffer.from(privateKey)` in
/// `@semaphore-protocol/identity` v4: a string seed is hashed as its UTF-8
/// bytes; a hex seed without `0x` prefix is hashed as its hex characters).
///
/// Returns the secret scalar and identity commitment as canonical decimal
/// strings, matching the values the web client sends to the server.

#[cfg_attr(feature = "uniffi", uniffi::export)]
pub fn derive_semaphore_identity(seed: String) -> Result<SemaphoreIdentity, SemaphoreMoproError> {
    if seed.is_empty() {
        return Err(SemaphoreMoproError::invalid_inputs(
            "seed must not be empty",
        ));
    }

    derive_identity_from_bytes(seed.as_bytes())
}

fn derive_identity_from_bytes(seed_bytes: &[u8]) -> Result<SemaphoreIdentity, SemaphoreMoproError> {
    use taceo_ark_babyjubjub::{EdwardsAffine, Fr as JubFr};

    // 1. Blake-512 of the seed and keep the first 32 bytes (matches
    //    @zk-kit/eddsa-poseidon `deriveSecretScalar`).
    let hash = Blake512::digest(seed_bytes);
    let mut clamped: [u8; 32] = hash[..32].try_into().map_err(|_| {
        SemaphoreMoproError::invalid_inputs("Blake-512 output is shorter than 32 bytes")
    })?;

    // 2. Standard Curve25519/Ed25519-style "pruning" of the lower 32 bytes.
    clamped[0] &= 0xf8;
    clamped[31] &= 0x7f;
    clamped[31] |= 0x40;

    // 3. Interpret as little-endian, drop the bottom 3 bits, reduce mod the
    //    Baby Jubjub subgroup order. The result is the secret scalar.
    let scalar_biguint: BigUint = (BigUint::from_bytes_le(&clamped) >> 3) % subgroup_order();
    let scalar = JubFr::from(scalar_biguint.clone());

    // 4. Public key = scalar * Base8 on Baby Jubjub (standard form).
    let public_key: EdwardsAffine = (EdwardsAffine::generator() * scalar).into();

    // 5. Commitment = poseidon([pkX, pkY]) using circomlib parameters.
    let mut poseidon = Poseidon::<ark_bn254::Fr>::new_circom(2)
        .map_err(|err| SemaphoreMoproError::proof(format!("poseidon init: {err}")))?;
    let commitment_fr = poseidon
        .hash(&[public_key.x, public_key.y])
        .map_err(|err| SemaphoreMoproError::proof(format!("poseidon hash: {err}")))?;

    let commitment_biguint = BigUint::from(commitment_fr.into_bigint());

    Ok(SemaphoreIdentity {
        secret_decimal: scalar_biguint.to_string(),
        commitment_decimal: commitment_biguint.to_string(),
    })
}

fn subgroup_order() -> BigUint {
    BigUint::parse_bytes(
        b"2736030358979909402780800718157159386076813972158567259200215660948447373041",
        10,
    )
        .expect("hard-coded subgroup order is valid")
}

fn prove_semaphore20_inner(
    zkey_path: String,
    circuit_inputs_json: String,
) -> Result<CircomProof, SemaphoreMoproError> {
    CircomProver::prove(
        ProofLib::Arkworks,
        WitnessFn::RustWitness(witness::semaphore20_witness),
        circuit_inputs_json,
        zkey_path,
    )
        .map_err(SemaphoreMoproError::proof)
}

fn semaphore_proof_result(proof: CircomProof) -> Result<SemaphoreProofResult, SemaphoreMoproError> {
    let proof_points = pack_groth16_proof_points(&proof);
    let public_inputs: Vec<String> = proof.pub_inputs.clone().into();
    let proof_json = serde_json::to_string(&proof).map_err(SemaphoreMoproError::json)?;

    Ok(SemaphoreProofResult {
        proof_json,
        proof_points,
        public_inputs,
    })
}

fn pack_groth16_proof_points(proof: &CircomProof) -> Vec<String> {
    vec![
        proof.proof.a.x.to_string(),
        proof.proof.a.y.to_string(),
        proof.proof.b.x[1].to_string(),
        proof.proof.b.x[0].to_string(),
        proof.proof.b.y[1].to_string(),
        proof.proof.b.y[0].to_string(),
        proof.proof.c.x.to_string(),
        proof.proof.c.y.to_string(),
    ]
}

fn validate_decimal(field: &str, value: &str) -> Result<(), SemaphoreMoproError> {
    if value.is_empty() {
        return Err(SemaphoreMoproError::invalid_inputs(format!(
        "{field} must not be empty"
    )));
    }

    if !value.bytes().all(|byte| byte.is_ascii_digit()) {
        return Err(SemaphoreMoproError::invalid_inputs(format!(
        "{field} must be a decimal string"
    )));
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde::Deserialize;

    const ZKEY_PATH: &str = "../client/public/zk/semaphore_20.zkey";
    const VECTORS_JSON: &str =
    include_str!("../../client/src/tests/fixtures/cross-stack-vectors.json");

    #[derive(Debug, Deserialize)]
    struct CrossStackVectors {
        #[serde(rename = "identityVectors")]
        identity_vectors: Vec<IdentityVector>,
        #[serde(rename = "proofVectors")]
        proof_vectors: Vec<ProofVector>,
    }

    #[derive(Debug, Deserialize)]
    struct IdentityVector {
        #[serde(rename = "seedHex")]
        seed_hex: String,
        #[serde(rename = "secretScalar")]
        secret_scalar: String,
        commitment: String,
    }

    #[derive(Debug, Deserialize)]
    struct ProofVector {
        id: String,
        #[serde(rename = "witnessInputs")]
        witness_inputs: WitnessInputs,
        #[serde(rename = "proofPublicSignals")]
        proof_public_signals: ProofPublicSignals,
    }

    #[derive(Debug, Deserialize)]
    struct WitnessInputs {
        secret: String,
        #[serde(rename = "merkleProofLength")]
        merkle_proof_length: u32,
        #[serde(rename = "merkleProofIndex")]
        merkle_proof_index: u32,
        #[serde(rename = "merkleProofSiblings")]
        merkle_proof_siblings: Vec<String>,
        message: String,
        scope: String,
    }

    #[derive(Debug, Deserialize)]
    struct ProofPublicSignals {
        #[serde(rename = "orderedForGroth16Verifier")]
        ordered_for_groth16_verifier: Vec<String>,
    }

    fn witness_inputs_json(inputs: WitnessInputs) -> String {
        build_semaphore20_inputs_json(
            inputs.secret,
            inputs.merkle_proof_length.to_string(),
            inputs.merkle_proof_index.to_string(),
            inputs.merkle_proof_siblings,
            inputs.message,
            inputs.scope,
        )
            .expect("witness input JSON should serialize")
    }

    #[test]
    fn identity_derivation_matches_cross_stack_vectors() {
        let vectors: CrossStackVectors =
        serde_json::from_str(VECTORS_JSON).expect("vectors JSON should parse");

        assert!(
            !vectors.identity_vectors.is_empty(),
            "identity vectors fixture should not be empty"
        );

        for vector in vectors.identity_vectors {
            let identity = derive_semaphore_identity(vector.seed_hex.clone())
                .unwrap_or_else(|err| panic!("seed {}: derivation failed: {err}", vector.seed_hex));

            assert_eq!(
                identity.secret_decimal, vector.secret_scalar,
                "seed {}: secret scalar mismatch",
                vector.seed_hex
            );
            assert_eq!(
                identity.commitment_decimal, vector.commitment,
                "seed {}: commitment mismatch",
                vector.seed_hex
            );
        }
    }

    #[test]
    fn proof_roundtrip_matches_cross_stack_vectors() {
        let vectors: CrossStackVectors =
        serde_json::from_str(VECTORS_JSON).expect("vectors JSON should parse");

        for vector in vectors.proof_vectors {
            let circuit_inputs = witness_inputs_json(vector.witness_inputs);
            let proof = prove_semaphore20(ZKEY_PATH.to_string(), circuit_inputs)
                .unwrap_or_else(|err| panic!("{} proof generation failed: {err}", vector.id));

            assert_eq!(
                proof.public_inputs, vector.proof_public_signals.ordered_for_groth16_verifier,
                "{} public signals mismatch",
                vector.id
            );
            assert_eq!(
                proof.proof_points.len(),
                8,
                "{} proof point length",
                vector.id
            );
            assert!(
                proof
                    .proof_points
                    .iter()
                    .all(|point| !point.is_empty()
                        && point.bytes().all(|byte| byte.is_ascii_digit())),
                "{} proof points must be decimal field elements",
                vector.id
            );

            let valid = verify_semaphore20(ZKEY_PATH.to_string(), proof.proof_json)
                .unwrap_or_else(|err| panic!("{} proof verification failed: {err}", vector.id));

            assert!(valid, "{} proof did not verify", vector.id);
        }
    }

    #[test]
    fn witness_json_uses_array_values_for_rustwitness() {
        let json = build_semaphore20_inputs_json(
            "1".to_string(),
            "2".to_string(),
            "3".to_string(),
            vec!["0".to_string(); 20],
            "4".to_string(),
            "5".to_string(),
        )
            .expect("valid inputs should serialize");

        let value: serde_json::Value = serde_json::from_str(&json).unwrap();
        assert_eq!(value["secret"], serde_json::json!(["1"]));
        assert_eq!(value["merkleProofLength"], serde_json::json!(["2"]));
        assert_eq!(value["merkleProofIndex"], serde_json::json!(["3"]));
        assert_eq!(value["merkleProofSiblings"].as_array().unwrap().len(), 20);
        assert_eq!(value["message"], serde_json::json!(["4"]));
        assert_eq!(value["scope"], serde_json::json!(["5"]));
    }
}

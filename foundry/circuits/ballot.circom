pragma circom 2.1.5;

include "semaphore.circom";   // imports Semaphore's identity proof gadget
include "elgamal.circom";
include "ballot_wellformed.circom";

template Ballot(treeDepth, numCandidates) {

    // === Semaphore part ===
    signal input identityNullifier;
    signal input identityTrapdoor;
    signal input treePathIndices[treeDepth];
    signal input treeSiblings[treeDepth];
    signal input externalNullifier;
    
    signal output merkleRoot;
    signal output nullifierHash;
    
    component sem = Semaphore(treeDepth);
    sem.identityNullifier <== identityNullifier;
    sem.identityTrapdoor <== identityTrapdoor;
    // ... wire up Merkle path
    sem.externalNullifier <== externalNullifier;
    
    merkleRoot <== sem.root;
    nullifierHash <== sem.nullifierHash;
    
    // === Your additions ===

    signal input ballot[numCandidates];
    signal input encryptionRandomness[numCandidates];
    signal input publicKey[2];  // Baby Jubjub point
    signal output ciphertexts[numCandidates][2][2];  // (C1, C2) per candidate
    
    // Prove ballot is well-formed (e.g., one-hot)
    component wf = BallotWellformed(numCandidates);
    for (var i = 0; i < numCandidates; i++) wf.ballot[i] <== ballot[i];
    
    // Prove each ciphertext is correct ElGamal encryption
    component enc[numCandidates];
    for (var i = 0; i < numCandidates; i++) {
        enc[i] = ElGamalEncrypt();
        enc[i].plaintext <== ballot[i];
        enc[i].randomness <== encryptionRandomness[i];
        enc[i].publicKey[0] <== publicKey[0];
        enc[i].publicKey[1] <== publicKey[1];
        ciphertexts[i] <== enc[i].ciphertext;
    }
}

component main {public [externalNullifier, publicKey, ciphertexts]} = Ballot(20, 10);
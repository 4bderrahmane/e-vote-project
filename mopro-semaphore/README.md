# Privote Mopro Semaphore Bridge

This crate is the mobile proof-generation spike for Semaphore-20.

It uses the same browser artifacts currently committed under
`../client/public/zk/`:

- `semaphore_20.wasm`
- `semaphore_20.zkey`

The witness is generated through `rust-witness`, and the Groth16 proof is
generated and verified through `circom-prover` with Arkworks.

## Exposed Functions

- `build_semaphore20_inputs_json(...)`
  Builds the Rust witness input JSON shape expected by `circom-prover`.

- `prove_semaphore20(zkey_path, circuit_inputs_json)`
  Generates a Groth16 proof and returns:
  - `proof_json`: serialized `circom-prover` proof object
  - `proof_points`: packed 8-element proof array for Privote's vote API
  - `public_inputs`: `[merkleRoot, nullifier, messageHash, scopeHash]`

- `verify_semaphore20(zkey_path, proof_json)`
  Verifies a serialized proof against the same `.zkey`.

These functions are annotated for UniFFI through `mopro_ffi::app!()`, so the
same Rust surface can be exposed to Android Kotlin bindings and called from
Java.

## Verification

Run:

```bash
cargo test
```

The test suite consumes:

```text
../client/src/tests/fixtures/cross-stack-vectors.json
```

For each proof vector, it:

1. Builds the Semaphore-20 witness input JSON.
2. Generates a Groth16 proof with Arkworks.
3. Asserts that public signals match the TypeScript reference vectors.
4. Verifies the proof with the same `.zkey`.

## Android Bindings

Before generating Android bindings, make sure Android NDK is installed. On this
machine the SDK is under `~/Android/Sdk`, so a valid NDK should appear under:

```text
~/Android/Sdk/ndk/<version>/
```

After installing it, export:

```bash
export ANDROID_HOME="$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="$ANDROID_HOME"
export ANDROID_NDK_HOME="$ANDROID_HOME/ndk/<version>"
```

The Android bindings entrypoint is:

```bash
cargo run --bin android --features build
```

Mopro writes generated output into `MoproAndroidBindings/`, including JNI
libraries and generated Kotlin UniFFI bindings. The Java app can consume the
generated Kotlin classes as JVM classes after the Android Gradle module is
configured to include those sources and `jniLibs`.

For a modern physical Android phone, use:

```bash
ANDROID_ARCHS=aarch64-linux-android cargo run --bin android --features build
```

Use `ANDROID_ARCHS=x86_64-linux-android` only for a 64-bit Android emulator.

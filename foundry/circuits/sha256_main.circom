pragma circom 2.1.5;

include "sha256.circom";

component main {public [expectedDigest]} = Sha256Preimage(64);

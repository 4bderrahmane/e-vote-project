pragma circom 2.1.5;

include "sha256/sha256.circom";
include "bitify.circom";

template Sha256Bytes(nBytes) {
    signal input message[nBytes];
    signal output digest[256];
    signal output digestWords[8];

    component byteBits[nBytes];
    component hash = Sha256(nBytes * 8);
    component wordBits[8];

    for (var i = 0; i < nBytes; i++) {
        byteBits[i] = Num2Bits(8);
        byteBits[i].in <== message[i];

        for (var j = 0; j < 8; j++) {
            hash.in[i * 8 + j] <== byteBits[i].out[7 - j];
        }
    }

    for (var i = 0; i < 256; i++) {
        digest[i] <== hash.out[i];
    }

    for (var i = 0; i < 8; i++) {
        wordBits[i] = Bits2Num(32);

        for (var j = 0; j < 32; j++) {
            wordBits[i].in[j] <== digest[i * 32 + 31 - j];
        }

        digestWords[i] <== wordBits[i].out;
    }
}

template Sha256Preimage(nBytes) {
    signal input message[nBytes];
    signal input expectedDigest[256];
    signal output digestWords[8];

    component hash = Sha256Bytes(nBytes);

    for (var i = 0; i < nBytes; i++) {
        hash.message[i] <== message[i];
    }

    for (var i = 0; i < 256; i++) {
        hash.digest[i] === expectedDigest[i];
    }

    for (var i = 0; i < 8; i++) {
        digestWords[i] <== hash.digestWords[i];
    }
}

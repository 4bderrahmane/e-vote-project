import { Identity } from "@semaphore-protocol/identity";

// User creates identity locally (in browser)
const identity = new Identity();

// These are the key components:
const secreto = identity.privateKey;
// const secret = identity.getTrapdoor();      // private
// const nullifier = identity.getNullifier();  // private
// const commitment = identity.getCommitment(); // public
//
// console.log("secret:", secret.toString());
// console.log("nullifier:", nullifier.toString());
// console.log("commitment:", commitment.toString());

console.log("commitment:", secreto.toString());

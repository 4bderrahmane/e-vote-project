"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
const config_1 = require("hardhat/config");
const ContractStorage_1 = require("../helpers/ContractStorage");
const ContractVerifier_1 = require("../helpers/ContractVerifier");
/**
 * Main verification task which runs hardhat-etherscan task for all the deployed contract.
 */
(0, config_1.task)("verify-full", "Verify contracts listed in storage")
    .addFlag("force", "Ignore verified status")
    .setAction(async ({ force = false }, hre) => {
    const storage = ContractStorage_1.ContractStorage.getInstance();
    const verifier = new ContractVerifier_1.ContractVerifier(hre);
    const addressList = [];
    const entryList = [];
    let index = 0;
    const addEntry = (address, entry) => {
        if (!entry.verify) {
            return;
        }
        addressList.push(address);
        entryList.push(entry);
        index += 1;
    };
    const instances = storage.getInstances(hre.network.name);
    instances.forEach(([key, entry]) => {
        if (entry.id.includes("Poseidon")) {
            return;
        }
        addEntry(key, entry);
    });
    console.log("======================================================================");
    console.log("======================================================================");
    console.log(`Verification batch with ${addressList.length} entries of ${index} total.`);
    console.log("======================================================================");
    const summary = [];
    for (let i = 0; i < addressList.length; i += 1) {
        const address = addressList[i];
        const entry = entryList[i];
        const params = entry.verify;
        console.log("\n======================================================================");
        console.log(`[${i}/${addressList.length}] Verify contract: ${entry.id} ${address}`);
        console.log("\tArgs:", params?.args);
        const verifiedEntity = storage.getVerified(address, hre.network.name);
        if (!force && verifiedEntity) {
            console.log("Already verified");
        }
        else {
            // eslint-disable-next-line no-await-in-loop
            const [ok, err] = await verifier.verify(address, params?.args ?? "", params?.name);
            if (ok) {
                storage.setVerified(address, hre.network.name, true);
            }
            else {
                summary.push(`${address} ${entry.id}: ${err}`);
            }
        }
    }
    console.log("\n======================================================================");
    console.log(`Verification batch has finished with ${summary.length} issue(s).`);
    console.log("======================================================================");
    console.log(summary.join("\n"));
    console.log("======================================================================");
});
//# sourceMappingURL=verifyFull.js.map
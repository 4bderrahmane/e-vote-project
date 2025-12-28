"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genKeyPair = void 0;
const maci_crypto_1 = require("maci-crypto");
const maci_domainobjs_1 = require("maci-domainobjs");
const banner_1 = require("../utils/banner");
const theme_1 = require("../utils/theme");
/**
 * Generate a new Maci Key Pair
 * and print it to the screen
 * @param {IGenKeypairArgs} args - keypair generation params
 * @returns - keypair
 */
const genKeyPair = ({ seed, quiet = true }) => {
    (0, banner_1.banner)(quiet);
    // create the new random keypair if there is no seed value
    const keypair = new maci_domainobjs_1.Keypair(seed ? new maci_domainobjs_1.PrivKey(seed % maci_crypto_1.SNARK_FIELD_SIZE) : undefined);
    // serialize both private and public keys
    const serializedPubKey = keypair.pubKey.serialize();
    const serializedPrivKey = keypair.privKey.serialize();
    (0, theme_1.logGreen)(quiet, (0, theme_1.success)(`Public key: ${serializedPubKey}`));
    (0, theme_1.logGreen)(quiet, (0, theme_1.success)(`Private key: ${serializedPrivKey}`));
    return {
        publicKey: serializedPubKey,
        privateKey: serializedPrivKey,
    };
};
exports.genKeyPair = genKeyPair;
//# sourceMappingURL=genKeyPair.js.map
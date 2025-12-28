"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genMaciPubKey = void 0;
const maci_crypto_1 = require("maci-crypto");
const maci_domainobjs_1 = require("maci-domainobjs");
const banner_1 = require("../utils/banner");
const theme_1 = require("../utils/theme");
/**
 * Generate a new Maci Public key from a private key
 * @param privKey - the user private key
 * @param quiet - whether to log the output
 * @return the public key serialized
 */
const genMaciPubKey = (privkey, quiet = true) => {
    (0, banner_1.banner)(quiet);
    // we check that the provided private key is valid
    if (!maci_domainobjs_1.PrivKey.isValidSerializedPrivKey(privkey)) {
        (0, theme_1.logError)("Invalid private key");
    }
    const unserializedKey = maci_domainobjs_1.PrivKey.deserialize(privkey);
    const pubKey = new maci_domainobjs_1.PubKey((0, maci_crypto_1.genPubKey)(unserializedKey.rawPrivKey));
    (0, theme_1.logGreen)(quiet, (0, theme_1.success)(`Public key: ${pubKey.serialize()}`));
    // we give back the serialized public key
    return pubKey.serialize();
};
exports.genMaciPubKey = genMaciPubKey;
//# sourceMappingURL=genPubKey.js.map
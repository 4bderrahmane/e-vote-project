"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EContracts = exports.EInitialVoiceCreditProxies = exports.EGatekeepers = void 0;
/**
 * Enum represents gatekeeper types
 */
var EGatekeepers;
(function (EGatekeepers) {
    EGatekeepers["FreeForAll"] = "FreeForAllGatekeeper";
    EGatekeepers["EAS"] = "EASGatekeeper";
    EGatekeepers["GitcoinPassport"] = "GitcoinPassportGatekeeper";
    EGatekeepers["Hats"] = "HatsGatekeeper";
    EGatekeepers["HatsSingle"] = "HatsGatekeeperSingle";
    EGatekeepers["HatsMultiple"] = "HatsGatekeeperMultiple";
    EGatekeepers["Zupass"] = "ZupassGatekeeper";
    EGatekeepers["Semaphore"] = "SemaphoreGatekeeper";
    EGatekeepers["MerkleProof"] = "MerkleProofGatekeeper";
    EGatekeepers["SignUp"] = "SignUpGatekeeper";
})(EGatekeepers || (exports.EGatekeepers = EGatekeepers = {}));
/**
 * Enum represents initial voice credit proxies
 */
var EInitialVoiceCreditProxies;
(function (EInitialVoiceCreditProxies) {
    EInitialVoiceCreditProxies["Constant"] = "ConstantInitialVoiceCreditProxy";
})(EInitialVoiceCreditProxies || (exports.EInitialVoiceCreditProxies = EInitialVoiceCreditProxies = {}));
/**
 * Enum represents deployed contracts
 */
var EContracts;
(function (EContracts) {
    EContracts["ConstantInitialVoiceCreditProxy"] = "ConstantInitialVoiceCreditProxy";
    EContracts["FreeForAllGatekeeper"] = "FreeForAllGatekeeper";
    EContracts["EASGatekeeper"] = "EASGatekeeper";
    EContracts["GitcoinPassportGatekeeper"] = "GitcoinPassportGatekeeper";
    EContracts["HatsGatekeeper"] = "HatsGatekeeper";
    EContracts["HatsGatekeeperSingle"] = "HatsGatekeeperSingle";
    EContracts["HatsGatekeeperMultiple"] = "HatsGatekeeperMultiple";
    EContracts["ZupassGatekeeper"] = "ZupassGatekeeper";
    EContracts["ZupassGroth16Verifier"] = "ZupassGroth16Verifier";
    EContracts["SemaphoreGatekeeper"] = "SemaphoreGatekeeper";
    EContracts["MerkleProofGatekeeper"] = "MerkleProofGatekeeper";
    EContracts["SignUpGatekeeper"] = "SignUpGatekeeper";
    EContracts["Verifier"] = "Verifier";
    EContracts["MACI"] = "MACI";
    EContracts["StateAq"] = "StateAq";
    EContracts["PollFactory"] = "PollFactory";
    EContracts["MessageProcessorFactory"] = "MessageProcessorFactory";
    EContracts["TallyFactory"] = "TallyFactory";
    EContracts["PoseidonT3"] = "PoseidonT3";
    EContracts["PoseidonT4"] = "PoseidonT4";
    EContracts["PoseidonT5"] = "PoseidonT5";
    EContracts["PoseidonT6"] = "PoseidonT6";
    EContracts["VkRegistry"] = "VkRegistry";
    EContracts["Poll"] = "Poll";
    EContracts["Tally"] = "Tally";
    EContracts["MessageProcessor"] = "MessageProcessor";
    EContracts["AccQueue"] = "AccQueue";
    EContracts["AccQueueQuinaryBlankSl"] = "AccQueueQuinaryBlankSl";
    EContracts["AccQueueQuinaryMaci"] = "AccQueueQuinaryMaci";
})(EContracts || (exports.EContracts = EContracts = {}));
//# sourceMappingURL=types.js.map
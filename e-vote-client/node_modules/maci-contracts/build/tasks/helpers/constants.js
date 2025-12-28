"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEtherscanApiKeys = exports.getNetworkRpcUrls = exports.EChainId = exports.ESupportedChains = exports.EDeploySteps = void 0;
/**
 * Deploy steps
 */
var EDeploySteps;
(function (EDeploySteps) {
    EDeploySteps["ConstantInitialVoiceCreditProxy"] = "full:deploy-constant-initial-voice-credit-proxy";
    EDeploySteps["Gatekeepers"] = "full:deploy-gatekeepers";
    EDeploySteps["Verifier"] = "full:deploy-verifier";
    EDeploySteps["Poseidon"] = "full:deploy-poseidon";
    EDeploySteps["PollFactory"] = "full:deploy-poll-factory";
    EDeploySteps["MessageProcessorFactory"] = "full:deploy-message-processor-factory";
    EDeploySteps["TallyFactory"] = "full:deploy-tally-factory";
    EDeploySteps["Maci"] = "full:deploy-maci";
    EDeploySteps["VkRegistry"] = "full:deploy-vk-registry";
    EDeploySteps["Poll"] = "poll:deploy-poll";
})(EDeploySteps || (exports.EDeploySteps = EDeploySteps = {}));
/**
 * Supported networks for deployment and task running
 */
var ESupportedChains;
(function (ESupportedChains) {
    ESupportedChains["Sepolia"] = "sepolia";
    ESupportedChains["Optimism"] = "optimism";
    ESupportedChains["OptimismSepolia"] = "optimism_sepolia";
    ESupportedChains["Scroll"] = "scroll";
    ESupportedChains["ScrollSepolia"] = "scroll_sepolia";
    ESupportedChains["Arbitrum"] = "arbitrum";
    ESupportedChains["ArbitrumSepolia"] = "arbitrum_sepolia";
    ESupportedChains["Base"] = "base";
    ESupportedChains["BaseSepolia"] = "base_sepolia";
    ESupportedChains["Gnosis"] = "gnosis";
    ESupportedChains["GnosisChiado"] = "gnosis_chiado";
    ESupportedChains["Polygon"] = "polygon";
    ESupportedChains["PolygonAmoy"] = "polygon_amoy";
    ESupportedChains["Coverage"] = "coverage";
    ESupportedChains["Hardhat"] = "hardhat";
})(ESupportedChains || (exports.ESupportedChains = ESupportedChains = {}));
/**
 * Supported network chain ids for deployment and task running
 */
var EChainId;
(function (EChainId) {
    EChainId[EChainId["Hardhat"] = 31337] = "Hardhat";
    EChainId[EChainId["Optimism"] = 10] = "Optimism";
    EChainId[EChainId["OptimismSepolia"] = 11155420] = "OptimismSepolia";
    EChainId[EChainId["Sepolia"] = 11155111] = "Sepolia";
    EChainId[EChainId["Scroll"] = 534352] = "Scroll";
    EChainId[EChainId["ScrollSepolia"] = 534351] = "ScrollSepolia";
    EChainId[EChainId["Arbitrum"] = 42161] = "Arbitrum";
    EChainId[EChainId["ArbitrumSepolia"] = 421614] = "ArbitrumSepolia";
    EChainId[EChainId["Base"] = 8453] = "Base";
    EChainId[EChainId["BaseSepolia"] = 84532] = "BaseSepolia";
    EChainId[EChainId["Gnosis"] = 100] = "Gnosis";
    EChainId[EChainId["GnosisChiado"] = 10200] = "GnosisChiado";
    EChainId[EChainId["Polygon"] = 137] = "Polygon";
    EChainId[EChainId["PolygonAmoy"] = 80002] = "PolygonAmoy";
    EChainId[EChainId["Coverage"] = 1337] = "Coverage";
})(EChainId || (exports.EChainId = EChainId = {}));
/**
 * Get network rpc urls object
 *
 * @returns {Record<ESupportedChains, string>} rpc urls for supported networks
 */
const getNetworkRpcUrls = () => {
    const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL ?? "";
    const OP_RPC_URL = process.env.OP_RPC_URL ?? "";
    const OP_SEPOLIA_RPC_URL = process.env.OP_SEPOLIA_RPC_URL ?? "";
    const SCROLL_RPC_URL = process.env.SCROLL_RPC_URL ?? "";
    const SCROLL_SEPOLIA_RPC_URL = process.env.SCROLL_SEPOLIA_RPC_URL ?? "";
    const ARB_RPC_URL = process.env.ARB_RPC_URL ?? "";
    const ARB_SEPOLIA_RPC_URL = process.env.ARB_SEPOLIA_RPC_URL ?? "";
    const BASE_RPC_URL = process.env.BASE_RPC_URL ?? "";
    const BASE_SEPOLIA_RPC_URL = process.env.BASE_SEPOLIA_RPC_URL ?? "";
    const GNOSIS_RPC_URL = process.env.GNOSIS_RPC_URL ?? "";
    const GNOSIS_CHIADO_RPC_URL = process.env.GNOSIS_CHIADO_RPC_URL ?? "";
    const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL ?? "";
    const POLYGON_AMOY_RPC_URL = process.env.POLYGON_AMOY_RPC_URL ?? "";
    return {
        [ESupportedChains.Sepolia]: SEPOLIA_RPC_URL,
        [ESupportedChains.Optimism]: OP_RPC_URL,
        [ESupportedChains.OptimismSepolia]: OP_SEPOLIA_RPC_URL,
        [ESupportedChains.Scroll]: SCROLL_RPC_URL,
        [ESupportedChains.ScrollSepolia]: SCROLL_SEPOLIA_RPC_URL,
        [ESupportedChains.Arbitrum]: ARB_RPC_URL,
        [ESupportedChains.ArbitrumSepolia]: ARB_SEPOLIA_RPC_URL,
        [ESupportedChains.Base]: BASE_RPC_URL,
        [ESupportedChains.BaseSepolia]: BASE_SEPOLIA_RPC_URL,
        [ESupportedChains.Gnosis]: GNOSIS_RPC_URL,
        [ESupportedChains.GnosisChiado]: GNOSIS_CHIADO_RPC_URL,
        [ESupportedChains.Polygon]: POLYGON_RPC_URL,
        [ESupportedChains.PolygonAmoy]: POLYGON_AMOY_RPC_URL,
        [ESupportedChains.Coverage]: "http://localhost:8555",
        [ESupportedChains.Hardhat]: "http://localhost:8545",
    };
};
exports.getNetworkRpcUrls = getNetworkRpcUrls;
const getEtherscanApiKeys = () => ({
    [ESupportedChains.Sepolia]: process.env.ETH_ETHERSCAN_API_KEY,
    [ESupportedChains.Optimism]: process.env.OPTIMISM_ETHERSCAN_API_KEY,
    [ESupportedChains.OptimismSepolia]: process.env.OPTIMISM_ETHERSCAN_API_KEY,
    [ESupportedChains.Scroll]: process.env.SCROLL_ETHERSCAN_API_KEY,
    [ESupportedChains.ScrollSepolia]: process.env.SCROLL_ETHERSCAN_API_KEY,
    [ESupportedChains.Arbitrum]: process.env.ARB_ETHERSCAN_API_KEY,
    [ESupportedChains.ArbitrumSepolia]: process.env.ARB_ETHERSCAN_API_KEY,
    [ESupportedChains.Base]: process.env.BASE_ETHERSCAN_API_KEY,
    [ESupportedChains.BaseSepolia]: process.env.BASE_ETHERSCAN_API_KEY,
    [ESupportedChains.Gnosis]: process.env.GNOSIS_ETHERSCAN_API_KEY,
    [ESupportedChains.GnosisChiado]: process.env.GNOSIS_ETHERSCAN_API_KEY,
    [ESupportedChains.Polygon]: process.env.POLYGON_ETHERSCAN_API_KEY,
    [ESupportedChains.PolygonAmoy]: process.env.POLYGON_ETHERSCAN_API_KEY,
    [ESupportedChains.Coverage]: undefined,
    [ESupportedChains.Hardhat]: undefined,
});
exports.getEtherscanApiKeys = getEtherscanApiKeys;
//# sourceMappingURL=constants.js.map
/**
 * Deploy steps
 */
export declare enum EDeploySteps {
    ConstantInitialVoiceCreditProxy = "full:deploy-constant-initial-voice-credit-proxy",
    Gatekeepers = "full:deploy-gatekeepers",
    Verifier = "full:deploy-verifier",
    Poseidon = "full:deploy-poseidon",
    PollFactory = "full:deploy-poll-factory",
    MessageProcessorFactory = "full:deploy-message-processor-factory",
    TallyFactory = "full:deploy-tally-factory",
    Maci = "full:deploy-maci",
    VkRegistry = "full:deploy-vk-registry",
    Poll = "poll:deploy-poll"
}
/**
 * Supported networks for deployment and task running
 */
export declare enum ESupportedChains {
    Sepolia = "sepolia",
    Optimism = "optimism",
    OptimismSepolia = "optimism_sepolia",
    Scroll = "scroll",
    ScrollSepolia = "scroll_sepolia",
    Arbitrum = "arbitrum",
    ArbitrumSepolia = "arbitrum_sepolia",
    Base = "base",
    BaseSepolia = "base_sepolia",
    Gnosis = "gnosis",
    GnosisChiado = "gnosis_chiado",
    Polygon = "polygon",
    PolygonAmoy = "polygon_amoy",
    Coverage = "coverage",
    Hardhat = "hardhat"
}
/**
 * Supported network chain ids for deployment and task running
 */
export declare enum EChainId {
    Hardhat = 31337,
    Optimism = 10,
    OptimismSepolia = 11155420,
    Sepolia = 11155111,
    Scroll = 534352,
    ScrollSepolia = 534351,
    Arbitrum = 42161,
    ArbitrumSepolia = 421614,
    Base = 8453,
    BaseSepolia = 84532,
    Gnosis = 100,
    GnosisChiado = 10200,
    Polygon = 137,
    PolygonAmoy = 80002,
    Coverage = 1337
}
/**
 * Get network rpc urls object
 *
 * @returns {Record<ESupportedChains, string>} rpc urls for supported networks
 */
export declare const getNetworkRpcUrls: () => Record<ESupportedChains, string>;
export declare const getEtherscanApiKeys: () => Record<ESupportedChains, string | undefined>;
//# sourceMappingURL=constants.d.ts.map
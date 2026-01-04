import {createPublicClient, http, parseAbi, getContract} from "viem"
import {env} from "../config/env"

export const client = createPublicClient({
    transport: http(env.RPC_URL)
})

export const ELECTION_ABI = parseAbi([
    // your contract's public immutables / inherited public funcs
    "function externalNullifier() view returns (uint256)",
    "function getMerkleTreeDepth(uint256 groupId) view returns (uint256)",
    "function getMerkleTreeRoot(uint256 groupId) view returns (uint256)",

    // emitted by SemaphoreGroups
    "event MemberAdded(uint256 indexed groupId, uint256 index, uint256 identityCommitment, uint256 merkleTreeRoot)"
])

export function electionContract(address: `0x${string}`) {
    return getContract({
        address,
        abi: ELECTION_ABI,
        client
    })
}

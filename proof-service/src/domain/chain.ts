import {createPublicClient, getContract, http, parseAbi, isAddress, Address} from "viem"
import { env } from "../config/env"

export const client = createPublicClient({
    transport: http(env.RPC_URL)
})

export const ELECTION_ABI = parseAbi([
    "function externalNullifier() view returns (uint256)",
    "function getMerkleTreeDepth(uint256 groupId) view returns (uint256)",
    "function getMerkleTreeRoot(uint256 groupId) view returns (uint256)",
    "event MemberAdded(uint256 indexed groupId, uint256 index, uint256 identityCommitment, uint256 merkleTreeRoot)"
] as const)

export function electionContract(address: Address) {
    return getContract({
        address,
        abi: ELECTION_ABI,
        client
    })
}

export function requireAddress(value: string): Address {
    if (!isAddress(value)) throw new Error("Invalid address")
    return value;
}
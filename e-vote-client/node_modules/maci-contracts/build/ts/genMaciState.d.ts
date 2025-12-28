import { type Provider } from "ethers";
import { MaciState } from "maci-core";
import { type Keypair } from "maci-domainobjs";
/**
 * Generate a MaciState object from the events of a MACI and Poll smart contracts
 * @param provider - the ethereum provider
 * @param address - the address of the MACI contract
 * @param coordinatorKeypair - the keypair of the coordinator
 * @param pollId - the id of the poll for which we are fetching events
 * @param fromBlock - the block number from which to start fetching events
 * @param blocksPerRequest - the number of blocks to fetch in each request
 * @param endBlock - the block number at which to stop fetching events
 * @param sleepAmount - the amount of time to sleep between each request
 * @returns an instance of MaciState
 */
export declare const genMaciStateFromContract: (provider: Provider, address: string, coordinatorKeypair: Keypair, pollId: bigint, fromBlock?: number, blocksPerRequest?: number, endBlock?: number | undefined, sleepAmount?: number | undefined) => Promise<MaciState>;
//# sourceMappingURL=genMaciState.d.ts.map
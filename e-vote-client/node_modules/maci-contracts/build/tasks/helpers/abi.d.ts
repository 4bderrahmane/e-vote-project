import type { MACILibraryAddresses } from "../../typechain-types/factories/contracts/MACI__factory";
import type { MessageProcessorLibraryAddresses } from "../../typechain-types/factories/contracts/MessageProcessor__factory";
import type { PollFactoryLibraryAddresses } from "../../typechain-types/factories/contracts/PollFactory__factory";
import type { TallyLibraryAddresses } from "../../typechain-types/factories/contracts/Tally__factory";
/**
 * Create linked contract addresses object
 *
 * @param poseidonT3ContractAddress - PoseidonT3 contract address
 * @param poseidonT4ContractAddress - PoseidonT4 contract address
 * @param poseidonT5ContractAddress - PoseidonT5 contract address
 * @param poseidonT6ContractAddress - PoseidonT6 contract address
 * @returns
 */
export declare const linkPoseidonLibraries: (poseidonT3ContractAddress: string, poseidonT4ContractAddress: string, poseidonT5ContractAddress: string, poseidonT6ContractAddress: string) => TallyLibraryAddresses | MessageProcessorLibraryAddresses | MACILibraryAddresses | PollFactoryLibraryAddresses;
//# sourceMappingURL=abi.d.ts.map
import type { IGetGatekeeperTraitArgs, IRegisteredUserArgs, ISignupData, SignupArgs, IGetGatekeeperDataArgs, ISemaphoreGatekeeperData, IZupassGatekeeperData, IEASGatekeeperData, IHatsGatekeeperData, IMerkleProofGatekeeperData } from "../utils/interfaces";
import { GatekeeperTrait } from "../utils/interfaces";
/**
 * Signup a user to the MACI contract
 * @param {SignupArgs} args - The arguments for the signup command
 * @returns {ISignupData} The state index of the user and transaction hash
 */
export declare const signup: ({ maciPubKey, maciAddress, sgDataArg, ivcpDataArg, signer, quiet, }: SignupArgs) => Promise<ISignupData>;
/**
 * Checks if user is registered with public key
 * @param IRegisteredArgs - The arguments for the register check command
 * @returns user registered or not and state index, voice credit balance
 */
export declare const isRegisteredUser: ({ maciAddress, maciPubKey, signer, startBlock, quiet, }: IRegisteredUserArgs) => Promise<{
    isRegistered: boolean;
    stateIndex?: string;
    voiceCredits?: string;
}>;
/**
 * Get the gatekeeper type of the MACI contract
 * @param IGetGatekeeperTraitArgs - The arguments for the get gatekeeper type command
 * @returns The gatekeeper type
 */
export declare const getGatekeeperTrait: ({ maciAddress, signer, }: IGetGatekeeperTraitArgs) => Promise<GatekeeperTrait>;
/**
 * Get the semaphore gatekeeper data
 * @param IGetSemaphoreGatekeeperDataArgs - The arguments for the get semaphore gatekeeper data command
 * @returns The semaphore gatekeeper data
 */
export declare const getSemaphoreGatekeeperData: ({ maciAddress, signer, }: IGetGatekeeperDataArgs) => Promise<ISemaphoreGatekeeperData>;
/**
 * Get the zupass gatekeeper data
 * @param IGetGatekeeperDataArgs - The arguments for the get zupass gatekeeper data command
 * @returns The zupass gatekeeper data
 */
export declare const getZupassGatekeeperData: ({ maciAddress, signer, }: IGetGatekeeperDataArgs) => Promise<IZupassGatekeeperData>;
/**
 * Get the EAS gatekeeper data
 * @param IGetGatekeeperDataArgs - The arguments for the get eas gatekeeper data command
 * @returns The eas gatekeeper data
 */
export declare const getEASGatekeeperData: ({ maciAddress, signer, }: IGetGatekeeperDataArgs) => Promise<IEASGatekeeperData>;
/**
 * Get the hats single gatekeeper data
 * @param IGetGatekeeperDataArgs - The arguments for the get hats single gatekeeper data command
 * @returns The hats single gatekeeper data
 */
export declare const getHatsSingleGatekeeperData: ({ maciAddress, signer, }: IGetGatekeeperDataArgs) => Promise<IHatsGatekeeperData>;
/**
 * Get the merkleproof gatekeeper data
 * @param IGetGatekeeperDataArgs - The arguments for the get merkleproof gatekeeper data command
 * @returns The merkleproof gatekeeper data
 */
export declare const getMerkleProofGatekeeperData: ({ maciAddress, signer, }: IGetGatekeeperDataArgs) => Promise<IMerkleProofGatekeeperData>;
//# sourceMappingURL=signup.d.ts.map
import { Message, Keypair } from "maci-domainobjs";
import { Deployment } from "./Deployment";
/**
 * Utility function to send a batch of messages to a poll contract
 * @dev This function will attempt to send a batch of messages to a poll contract
 * and if it fails, it will attempt to send a smaller batch size
 * @param deployment - The deployment instance
 * @param message - The message to send
 * @param keypair - The keypair to sign the message with
 * @param batchSize - The number of messages to send
 */
export declare function publishBatch(deployment: Deployment, message: Message, keypair: Keypair, batchSize: number): Promise<void>;
//# sourceMappingURL=benchmarks.d.ts.map
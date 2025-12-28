export declare function generateActionNoExit(circuit: string | undefined, params: string[] | undefined, { config, destination }: {
    config?: string;
    destination?: string;
}): Promise<void>;
declare function generateAction(...params: Parameters<typeof generateActionNoExit>): Promise<void>;
export default generateAction;

export type ElectionStatus = "upcoming" | "open" | "closed";

export type Election = {
    id: string;
    name: string;
    status: ElectionStatus;
    startDate: string; // ISO string
    endDate: string;   // ISO string
};
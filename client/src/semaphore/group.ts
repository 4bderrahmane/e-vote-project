// src/semaphore/groupApi.ts
export type MerkleProofDTO = {
    root: string;          // bigint as string
    leaf: string;          // commitment as string
    siblings: string[];    // bigint strings
    pathIndices: number[]; // 0/1
};

export async function fetchMerkleProof(electionId: string, commitment: string) {
    const res = await fetch(`/api/elections/${electionId}/merkle-proof?commitment=${commitment}`);
    if (!res.ok) throw new Error("Failed to fetch merkle proof");
    return (await res.json()) as MerkleProofDTO;
}

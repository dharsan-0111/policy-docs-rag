export interface Chunk {
    id: number;
    title?: string;
    content: string;
    chunkIndex: number;
    embedding: number[] | null;
    documentId: number;
    distance?: number;
}
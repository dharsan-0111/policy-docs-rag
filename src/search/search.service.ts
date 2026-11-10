import { Injectable } from '@nestjs/common';
import { EmbeddingService } from '../embeddings/embeddings.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chunk } from '../documents/entities/chunk.entity.js';
import type { Chunk as ChunkInterface } from '../documents/interfaces/chunk.interface.js';
import { LlmService } from '../llm/llm.service.js';

@Injectable()
export class SearchService {
    constructor(
        private readonly embeddingService: EmbeddingService,
        private readonly llmservice: LlmService,
        @InjectRepository(Chunk) private readonly chunkRepo: Repository<Chunk>
    ) { }

    async search (question: string): Promise<ChunkInterface[]> {
        const embedding = await this.embeddingService.embed(question)
        return this.chunkRepo.query(
            `SELECT c.id, content, "chunkIndex", d.title, embedding <=>
              $1::vector AS distance
            FROM chunk c
            JOIN document d ON d.id = c.document_id
            ORDER BY c.embedding <=> $1::vector LIMIT 3`,
            [JSON.stringify(embedding)]
        )
    }

    async ask(question: string) {
        const chunks = await this.search(question)
        const relevant = chunks.filter((chunk) => chunk?.distance as number < 0.50)
        if(relevant?.length === 0) {
            return {
                answer: "I don't know",
                sources: []
            }
        }
        const context = relevant?.map((chunk) => chunk.content).join('\n\n---\n\n')
        const system = 'You answer questions about company policy. Use ONLY the context given.' + 
        'If the answer is not in the context, say "I don\'t know".'
        const user = `Context:\n${context}\n\nQuestion: ${question}`

        const answer = await this.llmservice.chat(system, user)
        const uniqueTitles = [...new Set (relevant?.map((c) => c.title ))].map((title) => ({
            title
        }))
        console.log(uniqueTitles, 'unique titles')
        return {
            answer,
            sources: uniqueTitles
        }
    }
}

import { Injectable } from '@nestjs/common';
import { readdir, readFile } from 'fs/promises';
import path from 'path';
import { makeChunks } from '../utils/util.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from '../documents/entities/document.entity.js';
import { Repository } from 'typeorm';
import { DocumentIngestionStatus } from '../documents/enum/document.enum.js';
import { createHash } from 'crypto';
import { Chunk } from '../documents/entities/chunk.entity.js';
import { EmbeddingService } from '../embeddings/embeddings.service.js';

@Injectable()
export class IngestionService {

    constructor(
        @InjectRepository(Document) private documentRepo: Repository<Document>,
        @InjectRepository(Chunk) private chunkRepo: Repository<Chunk>,
        private readonly embeddingService: EmbeddingService
    ) {}

    async runIngestion() {
        const docsFolderDir = path.join(process.cwd(), 'docs');
        const files = await readdir(docsFolderDir)

        for (const file of files) {
            const filePath = path.join(docsFolderDir, file)
            const content = await readFile(filePath, 'utf-8');

            await this.documentRepo.delete({ sourcePath: filePath })

            const savedDoc = await this.documentRepo.save({
                sourcePath: filePath,
                title: file,
                description: content.slice(0,100),
                status: DocumentIngestionStatus.INGESTED,
                ingested_at: Math.floor(Date.now() / 1000),
                contentHash: createHash('sha256').update(content).digest('hex')
            })

            const chunkedResponse = makeChunks(content, 500);
            console.log(chunkedResponse.length, 'Total chunks')

            // chunkedResponse.forEach(async (chunkText, index) => {
            //     // 1. split(/\s+/) breaks the chunk into an array of words based on spaces
            //     // 2. slice(0, 5) takes only the first 5 words from that array
            //     // 3. join(' ') glues those 5 words back together into a readable string
            //     // const firstFiveWords = chunkText.split(/\s+/).slice(0, 5).join(' ');
            //     // console.log(`Chunk ${index + 1} starts with: "${firstFiveWords}..."`);
                
            //     await this.chunkRepo.save({ 
            //         content: chunkText,
            //         chunkIndex: index,
            //         document: savedDoc
            //      })
            // });

            for (const [index, chunkText] of chunkedResponse.entries()) {
                const embedding = await this.embeddingService.embed(chunkText)
                await this.chunkRepo.save({
                    chunkIndex: index,
                    content: chunkText,
                    document: savedDoc,
                    embedding,
                })
            }
        }
    }
}

import { Module } from '@nestjs/common';
import { SearchService } from './search.service.js';
import { SearchController } from './search.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chunk } from '../documents/entities/chunk.entity.js';
import { EmbeddingsModule } from '../embeddings/embeddings.module.js';
import { LlmModule } from '../llm/llm.module.js';

@Module({
  providers: [SearchService],
  controllers: [SearchController],
  imports: [
    TypeOrmModule.forFeature([Chunk]),
    EmbeddingsModule,
    LlmModule
  ]
})
export class SearchModule {}

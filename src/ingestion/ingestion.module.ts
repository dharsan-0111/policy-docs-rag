import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service.js';
import { IngestionController } from './ingestion.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../documents/entities/document.entity.js';
import { Chunk } from '../documents/entities/chunk.entity.js';
import { EmbeddingsModule } from '../embeddings/embeddings.module.js';

@Module({
  providers: [IngestionService],
  controllers: [IngestionController],
  imports: [
    TypeOrmModule.forFeature([Document, Chunk]),
    EmbeddingsModule
  ]
})
export class IngestionModule {}

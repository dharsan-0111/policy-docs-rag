import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service.js';
import { DocumentsController } from './documents.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity.js';
import { Chunk } from './entities/chunk.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Document, Chunk])],
  controllers: [DocumentsController],
  providers: [DocumentsService],
})
export class DocumentsModule {}

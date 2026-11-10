import { Injectable } from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto.js';
import { UpdateDocumentDto } from './dto/update-document.dto.js';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from './entities/document.entity.js';

@Injectable()
export class DocumentsService {

  constructor(
    @InjectRepository(Document)
    private repo: Repository<Document>
  ) { }

  create(createDocumentDto: CreateDocumentDto) {
    return this.repo.save(this.repo.create(createDocumentDto))
  }

  count() {
    return this.repo.count()
  }

  findAll() {
    return this.repo.find()
  }

  findOne(id: number) {
    // return this.repo.createQueryBuilder('d').
    // where ('d.title is :id', { q:  })
  }

  search(query: string) {
    return this.repo.createQueryBuilder('d')
      .where('d.description ILIKE :q', { q: `%${query}%` })
      .getManyAndCount()
    
  }

  async update(id: number, updateDocumentDto: UpdateDocumentDto) {
    await this.repo.update(id, updateDocumentDto)
    return await this.repo.find()
  }

  async remove(id: number) {
    await this.repo.delete(id)
    return 'Document removed successfully'
  }
}

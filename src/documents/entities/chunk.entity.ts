import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from 'typeorm';
import { Document } from "./document.entity.js";

@Entity()
export class Chunk {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @Column()
    chunkIndex: number;

    @Column({ type: 'vector', length: 768, nullable: true })
    embedding: number[] | null;

    @ManyToOne(() => Document, (document) => document.chunks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'document_id' })
    document: Relation<Document>;
}
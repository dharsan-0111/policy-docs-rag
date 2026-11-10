import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import type { Relation } from "typeorm";
import { DocumentIngestionStatus } from "../enum/document.enum.js";
import { Chunk } from "./chunk.entity.js";

@Entity()
export class Document {

    @Column()
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    sourcePath: string;
    
    @Column({ nullable: false })
    title: string;

    @Column()
    contentHash: string;

    @Column()
    status: DocumentIngestionStatus;

    @Column()
    ingested_at: number;

    @Column({ nullable: true })
    description?: string;

    @OneToMany(() => Chunk, (chunk) => chunk.document)
    chunks: Relation<Chunk>[];
}

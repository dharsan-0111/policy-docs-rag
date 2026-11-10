import { Module } from "@nestjs/common";
import { EmbeddingService } from "./embeddings.service.js";

@Module({
    providers: [EmbeddingService],
    exports: [EmbeddingService]
})

export class EmbeddingsModule {}
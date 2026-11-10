import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import OpenAI from "openai";

@Injectable()
export class EmbeddingService {
    client: OpenAI;
    constructor(
        private readonly configService: ConfigService
    ) {
        this.client = new OpenAI({
            baseURL: this.configService.get('EMBEDDING_BASE_URL'),
            apiKey: this.configService.get('EMBEDDING_API_KEY'),
        })
    }

    async embed(text: string): Promise<number[]> {
        const res = await this.client.embeddings.create({
            model: this.configService.get('EMBEDDING_MODEL') as string,
            input: text
        })

        return res.data[0].embedding
    }

}
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class LlmService {
    client: OpenAI;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.client = new OpenAI({
            baseURL: this.configService.get('EMBEDDING_BASE_URL'),
            apiKey: this.configService.get('EMBEDDING_API_KEY'),
        });
    }

    async chat(system: string, user: string): Promise<string> { 
        const res = await this.client.chat.completions.create({
            model: this.configService.get('CHAT_MODEL') as string,
            temperature: 0,
            messages: [
                {
                    role: 'system', content: system
                },
                {
                    role: 'user', content: user
                }
            ]
        })

        return res.choices[0].message.content ?? ''
    }
}

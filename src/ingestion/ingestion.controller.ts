import { Controller, Post, UseGuards } from "@nestjs/common";
import { IngestionService } from "./ingestion.service.js";
import { AuthGuard } from "../authentication/auth.guard.js";

@UseGuards(AuthGuard)
@Controller('ingestion')
export class IngestionController {

    constructor (private readonly ingestionService: IngestionService) {
    }

    @Post('/run')
    async runIngestion() {
        await this.ingestionService.runIngestion()
    }
}
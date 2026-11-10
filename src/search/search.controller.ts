import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service.js';
import { AuthGuard } from '../authentication/auth.guard.js';

@UseGuards(AuthGuard)
@Controller('search')
export class SearchController {

    constructor(
        private readonly searchService: SearchService
    ) {}

    @Get()
    async search(@Query('q') q: string) {
        return await this.searchService.search(q)
    }

    @Get('chat')
    async ask(@Query('q') q: string) {
        return await this.searchService.ask(q)
    }
}

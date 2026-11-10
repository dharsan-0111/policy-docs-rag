import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto.js';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {

    @IsNotEmpty()
    @IsString()
    title: string;

    description?: string | undefined;
}

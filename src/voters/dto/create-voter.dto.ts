import { IsString, IsNotEmpty } from 'class-validator';

export class CreateVoterDto {
    @IsString()
    @IsNotEmpty()
    document_number: string;
}

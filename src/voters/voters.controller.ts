import {
    Controller,
    Post,
    Body,
    UseGuards,
    UseInterceptors,
    Req,
} from '@nestjs/common';
import { VotersService } from './voters.service';
import { CreateVoterDto } from './dto/create-voter.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { TenantInterceptor } from '../common/interceptors/tenant.interceptor';

@Controller('voters')
@UseGuards(AuthGuard)
export class VotersController {
    constructor(private readonly votersService: VotersService) { }

    @Post()
    @UseInterceptors(TenantInterceptor)
    create(@Req() request: any, @Body() createVoterDto: CreateVoterDto) {
        const tenantId = request.tenantId;
        return this.votersService.create(tenantId, createVoterDto);
    }
}

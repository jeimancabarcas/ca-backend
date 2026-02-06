import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotersService } from './voters.service';
import { Voter } from './entities/voter.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { TruoraService } from '../services/truora/truora.service';
import { VotersController } from './voters.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Voter, Tenant])],
    controllers: [VotersController],
    providers: [VotersService, TruoraService],
})
export class VotersModule { }

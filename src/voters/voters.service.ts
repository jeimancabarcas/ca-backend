import {
    Injectable,
    ConflictException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Voter } from './entities/voter.entity';
import { Tenant } from '../tenants/entities/tenant.entity';
import { TruoraService } from '../services/truora/truora.service';
import { CreateVoterDto } from './dto/create-voter.dto';

@Injectable()
export class VotersService {
    constructor(
        @InjectRepository(Voter)
        private votersRepository: Repository<Voter>,
        @InjectRepository(Tenant)
        private tenantsRepository: Repository<Tenant>,
        private truoraService: TruoraService,
    ) { }

    async create(tenantId: string, createVoterDto: CreateVoterDto): Promise<Voter> {
        const { document_number } = createVoterDto;

        // 0. Get Tenant Info (to check target city)
        const tenant = await this.tenantsRepository.findOne({ where: { id: tenantId } });
        if (!tenant) {
            throw new NotFoundException('Tenant not found');
        }

        // 1. Check if voter exists LOCALLY for this tenant
        const existingVoter = await this.votersRepository.findOne({
            where: { document_number, tenant_id: tenantId },
        });

        if (existingVoter) {
            throw new ConflictException(
                `Voter with document ${document_number} already registered for this campaign.`,
            );
        }

        // 2. Call Truora API (Mock)
        const truoraData = await this.truoraService.validateVoter(document_number);

        if (!truoraData.exists) {
            throw new BadRequestException('Identity verification failed: Voter does not exist.');
        }

        // 3. Validate City (Business Rule)
        // If tenant has a specific base city, we might want to enforce checking.
        // Assuming tenant.base_city is the target.

        // Normalizing strings for comparison
        const targetCity = tenant.base_city ? tenant.base_city.toUpperCase().trim() : null;
        const voterCity = truoraData.city ? truoraData.city.toUpperCase().trim() : null;

        if (targetCity && voterCity !== targetCity) {
            // Decide if we block or just mark as specific status. Requirement says "Validar si coincide".
            // Implicitly, if not correct, maybe we shouldn't register or register with warning.
            // "Paso 5: Si todo es correcto, guardar..." implies we don't save if not correct.
            throw new BadRequestException(
                `Voter city (${voterCity}) does not match campaign target city (${targetCity}).`,
            );
        }

        // 4. Save to DB
        const newVoter = this.votersRepository.create({
            tenant_id: tenantId,
            document_number,
            full_name: truoraData.full_name || '',
            city: voterCity || undefined,
            polling_station: truoraData.polling_station || undefined,
            is_verified: true,
        });

        return this.votersRepository.save(newVoter);
    }
}

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TruoraService {
    private readonly logger = new Logger(TruoraService.name);

    async validateVoter(documentNumber: string): Promise<{
        exists: boolean;
        full_name?: string;
        city?: string;
        polling_station?: string;
    }> {
        this.logger.log(`Calling Truora API for document: ${documentNumber}...`);

        // Simulate API latency
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock response logic
        // For testing: documents starting with '1' are valid, others invalid or not found
        if (documentNumber.startsWith('1')) {
            return {
                exists: true,
                full_name: 'JUAN PEREZ MOCK',
                city: 'BOGOTA', // Default mock city
                polling_station: 'MESA 1 PUESTO 1'
            };
        } else {
            return {
                exists: false
            };
        }
    }
}

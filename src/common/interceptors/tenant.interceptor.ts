import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const tenantId = request.headers['x-tenant-id'];

        if (!tenantId) {
            throw new BadRequestException('Tenant ID header (x-tenant-id) is missing');
        }

        // Attach tenantId to the request object for easy access in controllers/services
        request['tenantId'] = tenantId;

        return next.handle();
    }
}

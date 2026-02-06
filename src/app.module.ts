import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VotersModule } from './voters/voters.module';
import { Voter } from './voters/entities/voter.entity';
import { Tenant } from './tenants/entities/tenant.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'candidate_analytics',
      entities: [Voter, Tenant],
      synchronize: true, // Auto-schema sync for dev (disable in prod)
    }),
    VotersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

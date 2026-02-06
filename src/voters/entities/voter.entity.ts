import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('voters')
@Index(['document_number', 'tenant_id'], { unique: true }) // Composite Unique Constraint
export class Voter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id' })
    tenant_id: string;

    @Column()
    document_number: string;

    @Column()
    full_name: string;

    @Column({ nullable: true })
    polling_station: string;

    @Column({ nullable: true })
    city: string;

    @Column({ default: false })
    is_verified: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
}

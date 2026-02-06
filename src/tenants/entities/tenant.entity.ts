import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tenants')
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    candidate_name: string;

    @Column({ nullable: true })
    base_city: string; // The target city for this campaign

    @Column({ type: 'jsonb', nullable: true })
    branding: {
        primaryColor: string;
        secondaryColor: string;
        logoUrl: string;
    };
}

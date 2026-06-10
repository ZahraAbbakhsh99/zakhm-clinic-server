import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('site_settings')
export class SiteSetting {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  phone!: string;

  @Column({ nullable: true })
  mobile!: string; 

  @Column({ nullable: true })
  email!: string;

  @Column({ type: 'text', nullable: true })
  address!: string;

  @Column({ type: 'text', nullable: true })
  workingHours!: string; 

  @Column({ type: 'jsonb', nullable: true, default: {} })
  socialMedia!: Record<string, string>; // like { "instagram": "url", "telegram": "url", "whatsapp": "url" }

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
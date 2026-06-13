import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('comments')
@Index(['entityType', 'entityId', 'isApproved']) // برای جستجوی سریع
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'entity_type' })
  entityType!: string; // 'portfolio', 'testimonial_video', ...

  @Column({ name: 'entity_id' })
  entityId!: string;

  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column({ type: 'text' })
  comment!: string;

  @Column({ name: 'is_approved', default: false })
  isApproved!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity('portfolios')
export class Portfolio {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text', name: 'short_description' })
  shortDescription!: string;

  @Column({ type: 'text', name: 'treatment_process' })
  treatmentProcess!: string;

  @Column({ name: 'before_image' })
  beforeImage!: string;

  @Column({ name: 'after_image' })
  afterImage!: string;

  @Column({ name: 'category_id' })
  categoryId!: string;

  @ManyToOne(() => Category, (category) => category.portfolios, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
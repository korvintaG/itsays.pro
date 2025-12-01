import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';

@Entity('things')
@Index(['user_id', 'name'], { unique: true })
export class Thing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 8, unique:true })
  UIN: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToOne(() => User, (user) => user.things, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int' })
  user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'varchar', nullable: true})
  image_URL: string;

  @OneToMany(() => Message, (message) => message.thing)
  messages: Message[];
}


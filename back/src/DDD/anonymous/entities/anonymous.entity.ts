import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Message } from '../../messages/entities/message.entity';

@Entity('anonymous')
export class Anonymous {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'varchar' })
  finger_point: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  cookie: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Message, (message) => message.anonymous)
  messages: Message[];
}


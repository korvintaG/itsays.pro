import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Thing } from '../../things/entities/thing.entity';
import { Anonymous } from '../../anonymous/entities/anonymous.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  author_name: string;

  @ManyToOne(() => Thing, (thing) => thing.messages, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'thing_id' })
  thing: Thing;

  @Column({ type: 'int' })
  thing_id: number;

  @ManyToOne(() => Anonymous, (anonymous) => anonymous.messages, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'anonymous_user_id' })
  anonymous: Anonymous;

  @Column({ type: 'int', nullable: true })
  anonymous_user_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


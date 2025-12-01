import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Thing } from '../../things/entities/thing.entity';
import { Role } from 'src/types/custom';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', select: false, nullable: true })
  id_out: string;

  //id по чату в TelegramBot
  @Column({ type: 'varchar', nullable: true, default: '' })
  chat_id: string;

  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column('varchar', { select: false })
  password: string;

  // варианты:
  // =0 - обычный
  // =1 - админ
  // =2 - удаленный
  // =3 - суперадмин
  @Column({ type: 'int', default: 0, select: false })
  role_id: Role;


  @OneToMany(() => Thing, (thing) => thing.user)
  things: Thing[];

  /*@OneToMany(() => Attitude, (attitude) => attitude.user)
  attitudes: Attitude[];*/

}

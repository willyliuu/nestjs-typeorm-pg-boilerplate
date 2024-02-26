import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  uuid: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;

  @Column()
  deletedAt: Date;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @Column()
  adminUuid: string;

  @ManyToOne(() => User, (user) => user.uuid)
  @JoinColumn({ name: 'admin_uuid', referencedColumnName: 'uuid' })
  admin: User;
}

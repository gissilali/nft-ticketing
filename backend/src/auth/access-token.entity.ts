import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('access_tokens')
export class AccessTokenEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  accessToken: string;
}

import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TicketEntity } from '../ticketing/ticket.entity';

@Entity('events')
export class EventEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  organizer: string;

  @Column({ nullable: true })
  lockAddress: string;

  @Column()
  description: string;

  @Column()
  venue: string;

  @Column({ type: 'timestamp', nullable: false })
  startDate: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => TicketEntity, (ticket) => ticket.event)
  tickets: EventEntity[];
}

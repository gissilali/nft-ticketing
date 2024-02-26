import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventEntity } from '../events/event.entity';

export interface TransactionDetails {
  to: any;
  from: any;
  contractAddress: any;
  transactionIndex: any;
  gasUsed: any[];
  logsBloom: any;
  blockHash: any;
  transactionHash: any;
  logs: any[];
  blockNumber: any;
  confirmations: any;
  cumulativeGasUsed: any[];
  effectiveGasPrice: any[];
  status: any;
  type: any;
  byzantium: any;
  events: any[];
}

@Entity('tickets')
export class TicketEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ticketPrice: string;

  @Column()
  eventId: number;

  @Column()
  organizer: string;

  @Column()
  transactionHash: string;

  @Column()
  attendeeAddress: string;

  @Column({ nullable: true })
  commissionDeducted: string;

  @Column({ nullable: true })
  commissionTransactionHash: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @ManyToOne(() => EventEntity, (event) => event.tickets)
  event: EventEntity;
}

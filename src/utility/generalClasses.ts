import { EntityManager } from 'typeorm';

export class ServiceOptions {
  transactionManager?: EntityManager;
}

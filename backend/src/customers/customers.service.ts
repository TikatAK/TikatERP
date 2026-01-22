import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class CustomersService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const result = await this.pool.query(
      'SELECT * FROM customers WHERE status = $1 ORDER BY id',
      ['active']
    );
    return result.rows;
  }
}

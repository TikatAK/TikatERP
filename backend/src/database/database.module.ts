import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

const databaseProvider = {
  provide: 'DATABASE_POOL',
  useFactory: () => {
    return new Pool({
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT) || 5432,
      user: process.env.DATABASE_USER || 'erp_user',
      password: process.env.DATABASE_PASSWORD || 'erp_pass123',
      database: process.env.DATABASE_NAME || 'erp_db',
    });
  },
};

@Global()
@Module({
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}

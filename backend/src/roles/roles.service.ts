import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class RolesService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const result = await this.pool.query(
      'SELECT * FROM roles ORDER BY id'
    );
    return result.rows;
  }

  async findPermissions() {
    const result = await this.pool.query(
      'SELECT * FROM permissions ORDER BY id'
    );
    return result.rows;
  }

  async getRolePermissions(roleId: number) {
    const query = `
      SELECT p.* FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = $1
    `;
    const result = await this.pool.query(query, [roleId]);
    return result.rows;
  }
}

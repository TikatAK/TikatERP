import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class UsersService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findByUsername(username: string) {
    const result = await this.pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0];
  }

  async findById(id: number) {
    const result = await this.pool.query(
      'SELECT id, username, real_name, email, phone, status FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await this.pool.query(
      'SELECT id, username, real_name, email, phone, status, created_at FROM users ORDER BY id'
    );
    return result.rows;
  }

  async getUserPermissions(userId: number) {
    const query = `
      SELECT DISTINCT p.permission_code, p.permission_name, p.resource, p.action
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = $1
    `;
    const result = await this.pool.query(query, [userId]);
    return result.rows;
  }
}

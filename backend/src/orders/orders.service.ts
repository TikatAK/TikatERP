import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class OrdersService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll(filters?: any) {
    let query = 'SELECT o.*, c.customer_name, m.material_name FROM sales_orders o ';
    query += 'LEFT JOIN customers c ON o.customer_id = c.id ';
    query += 'LEFT JOIN materials m ON o.material_id = m.id ';
    query += 'ORDER BY o.created_at DESC';

    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const query = `
      SELECT o.*, c.customer_name, m.material_name
      FROM sales_orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN materials m ON o.material_id = m.id
      WHERE o.id = $1
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async create(orderData: any) {
    const query = `
      INSERT INTO sales_orders (order_no, customer_id, material_id, color_code,
        quantity, unit, delivery_date, status, created_by)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    const values = [
      orderData.orderNo,
      orderData.customerId,
      orderData.materialId,
      orderData.colorCode,
      orderData.quantity,
      orderData.unit || 'kg',
      orderData.deliveryDate,
      'pending',
      orderData.createdBy,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class CostService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async getJobCost(jobId: number) {
    const query = `
      SELECT cost_type, SUM(amount) as total
      FROM cost_records
      WHERE job_id = $1
      GROUP BY cost_type
    `;
    const result = await this.pool.query(query, [jobId]);

    const costBreakdown = result.rows.reduce((acc, row) => {
      acc[row.cost_type] = parseFloat(row.total);
      return acc;
    }, {});

    const totalCost = Object.values(costBreakdown).reduce((sum: number, val: any) => sum + val, 0);

    return {
      jobId,
      breakdown: costBreakdown,
      totalCost,
    };
  }

  async recordCost(costData: any) {
    const query = `
      INSERT INTO cost_records (job_id, cost_type, amount, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      costData.jobId,
      costData.costType,
      costData.amount,
      costData.description,
    ]);
    return result.rows[0];
  }

  async getOrderProfit(orderId: number) {
    const query = `
      SELECT
        o.id, o.order_no, o.quantity,
        SUM(cr.amount) as total_cost
      FROM sales_orders o
      LEFT JOIN production_jobs j ON o.id = j.order_id
      LEFT JOIN cost_records cr ON j.id = cr.job_id
      WHERE o.id = $1
      GROUP BY o.id, o.order_no, o.quantity
    `;
    const result = await this.pool.query(query, [orderId]);
    return result.rows[0];
  }
}

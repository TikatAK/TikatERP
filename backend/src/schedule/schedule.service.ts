import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ScheduleService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll(filters?: any) {
    let query = `
      SELECT j.*, o.order_no, m.material_name, c.customer_name
      FROM production_jobs j
      LEFT JOIN sales_orders o ON j.order_id = o.id
      LEFT JOIN materials m ON j.material_id = m.id
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY j.priority DESC, j.start_time ASC
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async createJob(jobData: any) {
    const query = `
      INSERT INTO production_jobs (job_no, order_id, material_id, quantity,
        workshop, machine_no, status, priority, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      jobData.jobNo,
      jobData.orderId,
      jobData.materialId,
      jobData.quantity,
      jobData.workshop,
      jobData.machineNo,
      'pending',
      jobData.priority || 5,
      jobData.startTime,
      jobData.endTime,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async updateSchedule(jobId: number, scheduleData: any) {
    const query = `
      UPDATE production_jobs
      SET start_time = $1, end_time = $2, machine_no = $3, priority = $4
      WHERE id = $5
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      scheduleData.startTime,
      scheduleData.endTime,
      scheduleData.machineNo,
      scheduleData.priority,
      jobId,
    ]);
    return result.rows[0];
  }
}

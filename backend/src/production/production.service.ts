import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class ProductionService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async getJobsByWorkshop(workshop: string) {
    const query = `
      SELECT j.*, o.order_no, m.material_name
      FROM production_jobs j
      LEFT JOIN sales_orders o ON j.order_id = o.id
      LEFT JOIN materials m ON j.material_id = m.id
      WHERE j.workshop = $1 AND j.status != 'completed'
      ORDER BY j.priority DESC
    `;
    const result = await this.pool.query(query, [workshop]);
    return result.rows;
  }

  async reportWork(reportData: any) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const insertQuery = `
        INSERT INTO work_reports (job_id, step_id, operator_id, report_type, quantity, remarks)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const result = await client.query(insertQuery, [
        reportData.jobId,
        reportData.stepId,
        reportData.operatorId,
        reportData.reportType || 'complete',
        reportData.quantity,
        reportData.remarks,
      ]);

      if (reportData.reportType === 'complete') {
        await client.query(
          'UPDATE process_steps SET status = $1, end_time = NOW() WHERE id = $2',
          ['completed', reportData.stepId]
        );
      }

      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  async reportIssue(issueData: any) {
    const query = `
      INSERT INTO quality_issues (job_id, issue_type, description, severity, reported_by, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const result = await this.pool.query(query, [
      issueData.jobId,
      issueData.issueType,
      issueData.description,
      issueData.severity,
      issueData.reportedBy,
      issueData.imageUrl,
    ]);
    return result.rows[0];
  }
}

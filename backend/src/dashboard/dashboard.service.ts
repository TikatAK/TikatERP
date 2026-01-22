import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class DashboardService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async getKPIs() {
    const totalOrdersQuery = 'SELECT COUNT(*) as count FROM sales_orders';
    const pendingJobsQuery = "SELECT COUNT(*) as count FROM production_jobs WHERE status != 'completed'";
    const completedJobsQuery = "SELECT COUNT(*) as count FROM production_jobs WHERE status = 'completed'";
    const qualityIssuesQuery = "SELECT COUNT(*) as count FROM quality_issues WHERE status = 'open'";

    const [totalOrders, pendingJobs, completedJobs, qualityIssues] = await Promise.all([
      this.pool.query(totalOrdersQuery),
      this.pool.query(pendingJobsQuery),
      this.pool.query(completedJobsQuery),
      this.pool.query(qualityIssuesQuery),
    ]);

    return {
      totalOrders: parseInt(totalOrders.rows[0].count),
      pendingJobs: parseInt(pendingJobs.rows[0].count),
      completedJobs: parseInt(completedJobs.rows[0].count),
      qualityIssues: parseInt(qualityIssues.rows[0].count),
    };
  }

  async getProductionTrend() {
    const query = `
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM production_jobs
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async getWorkshopLoad() {
    const query = `
      SELECT workshop, COUNT(*) as job_count
      FROM production_jobs
      WHERE status != 'completed'
      GROUP BY workshop
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }
}

import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class RecipesService {
  constructor(@Inject('DATABASE_POOL') private pool: Pool) {}

  async findAll() {
    const query = `
      SELECT r.*, m.material_name
      FROM recipes r
      LEFT JOIN materials m ON r.material_id = m.id
      WHERE r.status = 'active'
      ORDER BY r.created_at DESC
    `;
    const result = await this.pool.query(query);
    return result.rows;
  }

  async findOne(id: number) {
    const recipeQuery = `
      SELECT r.*, m.material_name
      FROM recipes r
      LEFT JOIN materials m ON r.material_id = m.id
      WHERE r.id = $1
    `;
    const itemsQuery = `
      SELECT ri.*, d.dye_name, d.unit
      FROM recipe_items ri
      LEFT JOIN dyes d ON ri.dye_id = d.id
      WHERE ri.recipe_id = $1
    `;

    const recipe = await this.pool.query(recipeQuery, [id]);
    const items = await this.pool.query(itemsQuery, [id]);

    return {
      ...recipe.rows[0],
      items: items.rows,
    };
  }

  async consumeMaterial(consumptionData: any) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');

      const insertQuery = `
        INSERT INTO material_consumption (job_id, dye_id, planned_quantity, actual_quantity, variance, operator_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const variance = consumptionData.actualQuantity - consumptionData.plannedQuantity;
      const result = await client.query(insertQuery, [
        consumptionData.jobId,
        consumptionData.dyeId,
        consumptionData.plannedQuantity,
        consumptionData.actualQuantity,
        variance,
        consumptionData.operatorId,
      ]);

      await client.query(
        'UPDATE dyes SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [consumptionData.actualQuantity, consumptionData.dyeId]
      );

      await client.query('COMMIT');
      return result.rows[0];
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }
}

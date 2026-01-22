import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CostService } from './cost.service';

@Controller('api/cost')
@UseGuards(JwtAuthGuard)
export class CostController {
  constructor(private costService: CostService) {}

  @Get('job/:id')
  async getJobCost(@Param('id') id: string) {
    return this.costService.getJobCost(parseInt(id));
  }

  @Post('record')
  async recordCost(@Body() costData: any) {
    return this.costService.recordCost(costData);
  }

  @Get('order/:id/profit')
  async getOrderProfit(@Param('id') id: string) {
    return this.costService.getOrderProfit(parseInt(id));
  }
}

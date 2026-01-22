import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('api/dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('kpis')
  async getKPIs() {
    return this.dashboardService.getKPIs();
  }

  @Get('production-trend')
  async getProductionTrend() {
    return this.dashboardService.getProductionTrend();
  }

  @Get('workshop-load')
  async getWorkshopLoad() {
    return this.dashboardService.getWorkshopLoad();
  }
}

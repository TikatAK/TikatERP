import { Controller, Get, Post, Body, Query, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductionService } from './production.service';

@Controller('api/production')
@UseGuards(JwtAuthGuard)
export class ProductionController {
  constructor(private productionService: ProductionService) {}

  @Get('jobs')
  async getJobs(@Query('workshop') workshop: string) {
    return this.productionService.getJobsByWorkshop(workshop);
  }

  @Post('work/report')
  async reportWork(@Body() reportData: any, @Request() req) {
    reportData.operatorId = req.user.userId;
    return this.productionService.reportWork(reportData);
  }

  @Post('issues')
  async reportIssue(@Body() issueData: any, @Request() req) {
    issueData.reportedBy = req.user.userId;
    return this.productionService.reportIssue(issueData);
  }
}

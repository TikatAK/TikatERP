import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ScheduleService } from './schedule.service';

@Controller('api/schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  async findAll() {
    return this.scheduleService.findAll();
  }

  @Post()
  async createJob(@Body() jobData: any) {
    return this.scheduleService.createJob(jobData);
  }

  @Put(':id/reassign')
  async updateSchedule(@Param('id') id: string, @Body() scheduleData: any) {
    return this.scheduleService.updateSchedule(parseInt(id), scheduleData);
  }
}

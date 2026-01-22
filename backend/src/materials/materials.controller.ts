import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MaterialsService } from './materials.service';

@Controller('api/materials')
@UseGuards(JwtAuthGuard)
export class MaterialsController {
  constructor(private materialsService: MaterialsService) {}

  @Get()
  async findAll() {
    return this.materialsService.findAll();
  }
}

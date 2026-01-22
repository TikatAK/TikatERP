import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecipesService } from './recipes.service';

@Controller('api/recipes')
@UseGuards(JwtAuthGuard)
export class RecipesController {
  constructor(private recipesService: RecipesService) {}

  @Get()
  async findAll() {
    return this.recipesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recipesService.findOne(parseInt(id));
  }

  @Post('consume')
  async consumeMaterial(@Body() consumptionData: any, @Request() req) {
    consumptionData.operatorId = req.user.userId;
    return this.recipesService.consumeMaterial(consumptionData);
  }
}

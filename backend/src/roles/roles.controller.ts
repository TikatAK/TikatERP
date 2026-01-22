import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesService } from './roles.service';

@Controller('api/roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get('permissions')
  async findPermissions() {
    return this.rolesService.findPermissions();
  }

  @Get(':id/permissions')
  async getRolePermissions(@Param('id') id: string) {
    return this.rolesService.getRolePermissions(parseInt(id));
  }
}

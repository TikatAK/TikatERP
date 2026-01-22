import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { CustomersModule } from './customers/customers.module';
import { MaterialsModule } from './materials/materials.module';
import { OrdersModule } from './orders/orders.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ProductionModule } from './production/production.module';
import { RecipesModule } from './recipes/recipes.module';
import { CostModule } from './cost/cost.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    UsersModule,
    RolesModule,
    CustomersModule,
    MaterialsModule,
    OrdersModule,
    ScheduleModule,
    ProductionModule,
    RecipesModule,
    CostModule,
    DashboardModule,
  ],
})
export class AppModule {}

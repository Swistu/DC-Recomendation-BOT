import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from '../config/data-source';
import { InitialSeeder } from 'src/seeds/initial.seeder';
import { RanksModule } from 'src/ranks/ranks.module';
import { UserRolesModule } from 'src/userRoles/userRoles.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Ensure ConfigService is available
    TypeOrmModule.forRootAsync({
      // Use the same TypeORM config as your main app, but potentially override for seeding if needed
      useFactory: () => ({
        ...dataSourceOptions,
        // Ensure entities are loaded for seeding
        entities: dataSourceOptions.entities,
        // Migrations are typically run separately, not by the seeder context
        migrations: [], // No migrations needed for the seeder context itself
      }),
    }),
    RanksModule,
    UserRolesModule,
  ],
  providers: [InitialSeeder],
})
export class SeedModule {}

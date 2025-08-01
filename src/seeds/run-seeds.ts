import 'reflect-metadata'; // Must be imported first for NestJS/TypeORM
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed.module'; // Import your SeedModule
import { InitialSeeder } from './initial.seeder'; // Import your seeder class

async function runSeeds() {
  console.log('Starting database seeding123...');
  try {
    console.log('hello');
    const appContext = await NestFactory.createApplicationContext(SeedModule);
    console.log('hello1');
    const initialSeeder = appContext.get(InitialSeeder);
    await initialSeeder.run(); // Execute the seeding logic

    await appContext.close(); // Close the application context
    console.log('hello2');

    console.log('All database seeds executed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1); // Exit with error code
  }
}

runSeeds();

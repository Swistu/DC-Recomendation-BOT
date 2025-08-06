import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' }); // Load environment variables from your .env file

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DATABASE,
  synchronize: true, // <--- CRITICAL: Always false for production, use migrations!
  logging: false, // Set to true in development to see SQL queries
  entities: ['dist/**/*.entity{.ts,.js}', 'src/**/*.entity{.ts,.js}'],
  migrations: [
    'dist/migrations/*{.ts,.js}', // Path to your compiled migration files
    'src/migrations/*{.ts,.js}',
  ],
  migrationsTableName: 'typeorm_migrations', // Table to track applied migrations
};

// This DataSource instance is used by the TypeORM CLI for migrations and seeding
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;

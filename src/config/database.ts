import { DataSource, DataSourceOptions } from 'typeorm';
import env from './env';
import path from 'path';

const baseConfig: DataSourceOptions = {
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [path.join(__dirname, '../components/**/data-access/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
  logging: env.NODE_ENV === 'development',
  synchronize: false, // Never true in production
};

const AppDataSource = new DataSource(baseConfig);

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized successfully');
    return AppDataSource;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default AppDataSource;
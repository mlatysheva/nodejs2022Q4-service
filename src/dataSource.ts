import { DataSource } from 'typeorm';
import { dataSourceConfig } from './typeOrmConfig';

export const AppDataSource = new DataSource(dataSourceConfig);
AppDataSource.initialize();

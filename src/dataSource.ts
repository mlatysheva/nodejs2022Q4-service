import { DataSource } from 'typeorm';
import { dataSourceConfig } from './typeOrmConfig';

export const AppDataSource = new DataSource(dataSourceConfig);
AppDataSource.initialize()
  .then(() => {
    console.log('Data source was initialised');
  })
  .catch((err) => {
    console.error(err);
  });

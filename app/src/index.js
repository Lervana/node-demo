import 'colors';

import DataLinker from './parsers/data-linker';
import SourceParser from './parsers/source-parser';
import { testDatabaseConnection } from './models/database';
import { entitiesService } from './services';
import { saveResult } from './utils';

const run = async () => {
  const databaseOk = await testDatabaseConnection();
  if (!databaseOk) throw new Error('Cannot connect to database, exiting');

  const sourceParser = new SourceParser();
  const dataLinker = new DataLinker();

  const data = sourceParser.parseSync();
  const linkedData = dataLinker.parseSync(data);
  await entitiesService.storeData(linkedData);

  const result = await entitiesService.readAll();
  saveResult(result);
  process.exit(0);
};

run().catch(error => {
  console.log(error);
  process.exit(1);
});

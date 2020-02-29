import 'colors';

import DataLinker from './parsers/data-linker';
import SourceParser from './parsers/source-parser';
import { testDatabaseConnection } from './models/database';
import { entitiesService } from './services';

const run = async () => {
  await testDatabaseConnection();

  const sourceParser = new SourceParser();
  const dataLinker = new DataLinker();

  const data = sourceParser.parseSync();
  const linkedData = dataLinker.parseSync(data);


  console.log(linkedData);

};

run().catch(error => {
  console.log(error);
  process.exit(1);
});

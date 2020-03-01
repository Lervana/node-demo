import fs from 'fs';
import path from 'path';

import { log } from './logger';

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const saveResult = (content, customFs) => {
  const fileSystem = customFs || fs;
  const filePath = path.join(path.resolve('.'), 'result.json');

  try {
    fileSystem.writeFileSync(filePath, JSON.stringify(content, null, 2));
    log.info(`Result saved in ${filePath}`);
  } catch (error) {
    log.error(`Cannot save result! ${error}`);
  }
};

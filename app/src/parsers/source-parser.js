import fs from 'fs';
import Url from 'url-parse';

const allowedEntitiesTypes = ['organization', 'person'];

export default class SourceParser {
  fs = undefined;

  constructor(customFs) {
    this.fs = customFs || fs;
  }

  checkIfFileExistsSync = filePath => {
    try {
      this.fs.accessSync(filePath);
      return true;
    } catch (e) {
      return false;
    }
  };

  loadSourceSync = filePath => {
    try {
      return this.fs.readFileSync(filePath);
    } catch (error) {
      throw new Error('Cannot read source file');
    }
  };

  simplifyUrl = data => {
    return data.replace('www.', '').replace('https', 'http');
  };

  simplifyData = data => {
    const validData = [];

    data.forEach(profile => {
      if (profile.url) profile.url = this.simplifyUrl(profile.url);
      if (profile.linksTo) profile.linksTo = profile.linksTo.map(link => this.simplifyUrl(link));
      allowedEntitiesTypes.indexOf(profile.entityType) !== -1 && validData.push(profile);
    });

    return validData;
  };

  parseSync = (args = process.argv) => {
    const filePath = args && Array.isArray(args) && args[2];

    if (filePath) {
      const fileExist = this.checkIfFileExistsSync(filePath);

      if (fileExist) {
        const data = this.loadSourceSync(filePath);

        try {
          return this.simplifyData(JSON.parse(data));
        } catch (e) {
          throw new Error('Cannot parse sourcefile');
        }
      } else throw new Error('Source file not found');
    } else throw new Error('You need to specify path for source file');
  };
}

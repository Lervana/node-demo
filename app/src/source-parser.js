import fs from 'fs';

export default class SourceParser {
  fs = undefined;

  constructor(customFs) {
    this.fs = customFs || fs;
  }

  checkIfFileExists = filePath => {
    try {
      this.fs.accessSync(filePath);
      return true;
    } catch (e) {
      return false;
    }
  };

  loadSource = filePath => {
    try {
      return this.fs.readFileSync(filePath);
    } catch (error) {
      if (error) throw new Error('Cannot read source file');
    }
  };

  parse = (args = process.argv) => {
    const filePath = args && Array.isArray(args) && args[2];

    if (filePath) {
      const fileExist = this.checkIfFileExists(filePath);

      if (fileExist) {
        const data = this.loadSource(filePath);

        try {
          return JSON.parse(data);
        } catch (e) {
          throw new Error('Cannot parse sourcefile');
        }
      } else throw new Error('Source file not found');
    } else throw new Error('You need to specify path for source file');
  };
}

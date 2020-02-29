import Url from 'url-parse';

export default class DataLinker {
  isWeb = data => {
    const url = new Url(data.url);
    return !url.pathname || url.pathname === '';
  };

  hasElement = (itemA, itemB) => itemA.linksTo.indexOf(itemB.url) !== -1;

  match = (itemA, itemB) => {
    if (itemA.entityType !== itemB.entityType) return false;

    if (this.isWeb(itemA) || this.isWeb(itemB)) {
      if (this.hasElement(itemA, itemB) && this.hasElement(itemB, itemA)) return true;
    }

    if (!this.isWeb(itemA) && !this.isWeb(itemB)) {
      if (this.hasElement(itemA, itemB)) return true;
      if (this.hasElement(itemB, itemA)) return true;
    }

    return false;
  };

  parseSync = data => {
    const result = [];

    data.forEach(item => {
      let match = false;

      result.forEach(resultItems => {
        let execute = true;

        resultItems.forEach(resultItem => {
          match = this.match(item, resultItem);
          if (match && execute) {
            resultItems.push(item);
            execute = false;
          }
        });
      });

      if (!match) result.push([item]);
    });

    return result;
  };
}

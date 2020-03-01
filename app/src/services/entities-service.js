import { ProfileModel } from '../models';
import { asyncForEach } from '../utils';
import BaseService from './base-service';
import { profilesService } from '.';

export default class EntitiesService extends BaseService {
  constructor(sequelize, model, customProfilesService) {
    super(sequelize, model);

    this.profilesService = customProfilesService || profilesService;

    this.options = {
      ...this.options,
      include: [
        {
          model: ProfileModel,
          as: 'profiles',
          attributes: ['id', 'url', 'entityType', 'linksTo'],
        },
      ],
    };
  }

  checkEntitiesIds = existingProfiles => {
    if (existingProfiles.length === 0) return false;

    const entityId = existingProfiles[0].entityId;
    let isValid = true;

    existingProfiles.forEach(profile => {
      if (profile.entityId !== entityId) isValid = false;
    });

    return isValid;
  };

  storeData = async data => {
    const transaction = await this.sequelize.transaction();

    await asyncForEach(data, async group => {
      const existingProfiles = [];

      await asyncForEach(group, async profile => {
        const item = await this.profilesService.readByUrl(profile.url);
        if (item) existingProfiles.push(item);
      });

      const isEntityIdValid = this.checkEntitiesIds(existingProfiles);
      const entityId = isEntityIdValid
        ? existingProfiles[0].entityId
        : (await this.create(transaction, { entityType: group[0].entityType })).id;

      await asyncForEach(group, async profile => {
        const params = { ...profile, linksTo: profile.linksTo.join(';'), entityId };
        await this.profilesService.findOrCreate(transaction, params, { url: profile.url });
      });
    });

    await transaction.commit();
  };

  async readAll(options = this.options) {
    const results = await super.readAll(options);
    return results.map(entity => ({
      ...entity,
      profiles: entity.profiles.map(profile => ({
        ...profile,
        linksTo: profile.linksTo && profile.linksTo.split(';'),
      })),
    }));
  }
}

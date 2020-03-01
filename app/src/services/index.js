import { sequelize as seq } from '../models/database';
import { ProfileModel, EntityModel } from '../models';

import EntitiesService from './entities-service';
import ProfilesService from './profiles-service';

export const profilesService = new ProfilesService(seq, ProfileModel);
export const entitiesService = new EntitiesService(seq, EntityModel);

export const EntitiesServiceClass = EntitiesService;
export const ProfilesServiceClass = ProfilesService;

import { UserProfile } from './user-profile';

export class GetUserProfileQueryResult {
  constructor(public readonly userProfile: UserProfile) {}
}

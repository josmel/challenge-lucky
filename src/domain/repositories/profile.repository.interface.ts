import { Profile } from '../models/profile.entity';

export interface ProfileRepository {
  createProfile(
    userId: string,
    addressId: string,
    name: string,
  ): Promise<string>;

  findAddressIdByUserId(userId: string): Promise<Profile | null>;
}

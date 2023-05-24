import { Injectable } from '@nestjs/common';
import { ProfileRepository } from 'src/domain/repositories/profile.repository.interface';
import { DatabaseProvider } from '../persistence/configs/database.provider';
import { Profile } from 'src/domain/models/profile.entity';

@Injectable()
export class ProfileRepositoryImpl implements ProfileRepository {
  constructor(private readonly dbProvider: DatabaseProvider) {}

  async createProfile(
    userId: string,
    addressId: string,
    name: string,
  ): Promise<string> {
    try {
      await this.dbProvider.query('BEGIN');

      const profileQuery = `
        INSERT INTO Profile (userId, addressId, name)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      const profileValues = [userId, addressId, name];

      const profileResult = await this.dbProvider.query(
        profileQuery,
        profileValues,
      );
      const profileId: string = profileResult[0].id;

      await this.dbProvider.query('COMMIT');

      return profileId;
    } catch (error) {
      await this.dbProvider.query('ROLLBACK');
      throw error;
    }
  }

  async findAddressIdByUserId(userId: string): Promise<Profile | null> {
    const query = `
      SELECT * FROM Profile
      WHERE userId = $1
    `;
    const values = [userId];

    try {
      const result = await this.dbProvider.query(query, values);

      const profile: Profile | null = result[0] || null;
      return profile;
    } catch (error) {
      throw error;
    }
  }
}

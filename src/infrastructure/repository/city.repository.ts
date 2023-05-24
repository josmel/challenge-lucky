import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../persistence/configs/database.provider';
import { CityRepository } from 'src/domain/repositories/city.repository.interface';
import { City } from 'src/domain/models/city.entity';

@Injectable()
export class CityRepositoryImpl implements CityRepository {
  constructor(private readonly dbProvider: DatabaseProvider) {}

  async findById(cityId: string): Promise<City | null> {
    const query = `
      SELECT * FROM City
      WHERE id = $1
    `;
    const values = [cityId];
    try {
      const result = await this.dbProvider.query(query, values);
      const country: City | null = result[0] || null;
      return country;
    } catch (error) {
      throw error;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../persistence/configs/database.provider';
import { CountryRepository } from 'src/domain/repositories/country.repository.interface';
import { Country } from 'src/domain/models/country.entity';

@Injectable()
export class CountryRepositoryImpl implements CountryRepository {
  constructor(private readonly dbProvider: DatabaseProvider) {}

  async findById(countryId: string): Promise<Country | null> {
    const query = `
      SELECT * FROM Country
      WHERE id = $1
    `;
    const values = [countryId];
    try {
      const result = await this.dbProvider.query(query, values);
      const country: Country | null = result[0] || null;
      return country;
    } catch (error) {
      throw error;
    }
  }
}

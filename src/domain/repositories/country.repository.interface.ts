import { Country } from '../models/country.entity';

export interface CountryRepository {
  findById(countryId: string): Promise<Country>;
}

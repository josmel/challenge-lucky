import { City } from '../models/city.entity';

export interface CityRepository {
  findById(cityId: string): Promise<City>;
}

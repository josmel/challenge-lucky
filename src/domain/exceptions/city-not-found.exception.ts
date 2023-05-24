export class CityNotFoundException extends Error {
  constructor(cityId: string) {
    super(`City with ID ${cityId} not found.`);
    this.name = 'CityNotFoundException';
  }
}

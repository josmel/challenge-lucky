import { Injectable } from '@nestjs/common';
import { DatabaseProvider } from '../persistence/configs/database.provider';
import { AddressRepository } from '../../domain/repositories/address.repository.interface';
import { Address } from '../../domain/models/address.entity';

@Injectable()
export class AddressRepositoryImpl implements AddressRepository {
  constructor(private readonly dbProvider: DatabaseProvider) {}

  async createAddress(street: string, cityId: string): Promise<string> {
    try {
      await this.dbProvider.query('BEGIN');

      const addressQuery = `
        INSERT INTO Address (street, cityId)
        VALUES ($1, $2)
        RETURNING id
      `;
      const addressValues = [street, cityId];

      const addressResult = await this.dbProvider.query(
        addressQuery,
        addressValues,
      );

      const addressId: string = addressResult[0].id;

      await this.dbProvider.query('COMMIT');

      return addressId;
    } catch (error) {
      await this.dbProvider.query('ROLLBACK');
      throw error;
    }
  }

  async findAddressById(addressId: string): Promise<Address | null> {
    const query = `
      SELECT * FROM Address
      WHERE id = $1
    `;
    const values = [addressId];
    try {
      const result = await this.dbProvider.query(query, values);
      const addressData = result[0];
      if (!addressData) {
        return null;
      }
      const address: Address = new Address(
        addressData.id,
        addressData.street,
        addressData.cityid,
      );
      return address;
    } catch (error) {
      throw error;
    }
  }
}

import { Address } from '../models/address.entity';

export interface AddressRepository {
  createAddress(street: string, cityId: string): Promise<string>;
  findAddressById(addressId: string): Promise<Address | null>;
}

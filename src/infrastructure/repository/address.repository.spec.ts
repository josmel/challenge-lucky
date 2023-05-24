import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseProvider } from '../persistence/configs/database.provider';
import { AddressRepositoryImpl } from './address.repository';
import { Address } from '../../domain/models/address.entity';

describe('AddressRepositoryImpl', () => {
  let repository: AddressRepositoryImpl;
  let dbProvider: DatabaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressRepositoryImpl,
        {
          provide: DatabaseProvider,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<AddressRepositoryImpl>(AddressRepositoryImpl);
    dbProvider = module.get<DatabaseProvider>(DatabaseProvider);
  });

  describe('createAddress', () => {
    it('should rollback transaction and rethrow error if an error occurs', async () => {
      const mockError = new Error('DB error');
      dbProvider.query = jest.fn().mockRejectedValueOnce(mockError);
      const street = 'Test Street';
      const cityId = 'city_id';

      await expect(repository.createAddress(street, cityId)).rejects.toThrow(
        'DB error',
      );

      expect(dbProvider.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('findAddressById', () => {
    it('should return the address when found', async () => {
      const addressId = 'address_id';
      dbProvider.query = jest.fn().mockResolvedValueOnce([{ id: addressId }]);

      const result = await repository.findAddressById(addressId);

      expect(dbProvider.query).toHaveBeenCalledTimes(1);
      expect(result).toBeInstanceOf(Address);
      expect(result?.id).toBe(addressId);
    });

    it('should return null if the address is not found', async () => {
      const addressId = 'address_id';

      dbProvider.query = jest.fn().mockResolvedValueOnce([]);

      const result = await repository.findAddressById(addressId);

      expect(dbProvider.query).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });

    it('should rethrow error if an error occurs', async () => {
      const addressId = 'address_id';

      dbProvider.query = jest.fn().mockRejectedValueOnce(new Error('DB error'));

      await expect(repository.findAddressById(addressId)).rejects.toThrow(
        'DB error',
      );

      expect(dbProvider.query).toHaveBeenCalledTimes(1);
    });
  });
});

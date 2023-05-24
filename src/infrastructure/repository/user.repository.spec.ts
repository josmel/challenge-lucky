import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseProvider } from '../persistence/configs/database.provider';
import { UserRepositoryImpl } from './user.repository';
import { User } from '../../domain/models/user.entity';

describe('UserRepositoryImpl', () => {
  let repository: UserRepositoryImpl;
  let dbProvider: DatabaseProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepositoryImpl,
        {
          provide: DatabaseProvider,
          useValue: {
            query: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = module.get<UserRepositoryImpl>(UserRepositoryImpl);
    dbProvider = module.get<DatabaseProvider>(DatabaseProvider);
  });

  describe('createUser', () => {
    it('should rollback transaction and rethrow error if an error occurs', async () => {
      const error = new Error('DB error');
      dbProvider.query = jest.fn().mockRejectedValueOnce(error);

      const username = 'testuser';
      const password = 'testpassword';

      await expect(repository.createUser(username, password)).rejects.toThrow(
        error,
      );

      expect(dbProvider.query).toHaveBeenCalledTimes(2); // BEGIN and ROLLBACK queries
    });
  });

  describe('findByUsername', () => {
    it('should return the user when found', async () => {
      const mockUser: User = {
        id: 'user_id',
        username: 'testuser',
        password: 'testpassword',
      };
      const mockQueryResult = [mockUser];
      dbProvider.query = jest.fn().mockResolvedValueOnce(mockQueryResult);

      const username = 'testuser';

      const result = await repository.findByUsername(username);

      expect(dbProvider.query).toHaveBeenCalledTimes(1);
      expect(dbProvider.query).toHaveBeenCalledWith(expect.any(String), [
        username,
      ]);
      expect(result).toEqual(mockUser);
    });

    it('should return null if the user is not found', async () => {
      dbProvider.query = jest.fn().mockResolvedValueOnce([]);

      const username = 'testuser';

      const result = await repository.findByUsername(username);

      expect(dbProvider.query).toHaveBeenCalledTimes(1);
      expect(dbProvider.query).toHaveBeenCalledWith(expect.any(String), [
        username,
      ]);
      expect(result).toBeNull();
    });

    it('should rethrow error if an error occurs', async () => {
      const error = new Error('DB error');
      dbProvider.query = jest.fn().mockRejectedValueOnce(error);

      const username = 'testuser';

      await expect(repository.findByUsername(username)).rejects.toThrow(error);

      expect(dbProvider.query).toHaveBeenCalledTimes(1);
      expect(dbProvider.query).toHaveBeenCalledWith(expect.any(String), [
        username,
      ]);
    });
  });

  describe('findUserById', () => {
    it('should return the user when found', async () => {
      const mockUser: User = {
        id: 'user_id',
        username: 'testuser',
        password: 'testpassword',
      };
      const mockQueryResult = [mockUser];
      dbProvider.query = jest.fn().mockResolvedValueOnce(mockQueryResult);

      const userId = 'user_id';

      const result = await repository.findUserById(userId);

      expect(dbProvider.query).toHaveBeenCalledTimes(1);
      expect(dbProvider.query).toHaveBeenCalledWith(expect.any(String), [
        userId,
      ]);
      expect(result).toEqual(mockUser);
    });

    it('should return null if the user is not found', async () => {
      dbProvider.query = jest.fn().mockResolvedValueOnce([]);

      const userId = 'user_id';

      const result = await repository.findUserById(userId);

      expect(dbProvider.query).toHaveBeenCalledTimes(1);
      expect(dbProvider.query).toHaveBeenCalledWith(expect.any(String), [
        userId,
      ]);
      expect(result).toBeNull();
    });

    it('should rethrow error if an error occurs', async () => {
      const error = new Error('DB error');
      dbProvider.query = jest.fn().mockRejectedValueOnce(error);

      const userId = 'user_id';

      await expect(repository.findUserById(userId)).rejects.toThrow(error);

      expect(dbProvider.query).toHaveBeenCalledTimes(1);
      expect(dbProvider.query).toHaveBeenCalledWith(expect.any(String), [
        userId,
      ]);
    });
  });
});

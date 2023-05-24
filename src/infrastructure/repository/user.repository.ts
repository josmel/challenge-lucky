import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/domain/repositories/user.repository.interface';
import { User } from 'src/domain/models/user.entity';
import { DatabaseProvider } from '../persistence/configs/database.provider';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(private readonly dbProvider: DatabaseProvider) {}

  async createUser(username: string, password: string): Promise<User> {
    try {
      await this.dbProvider.query('BEGIN'); // Start a transaction

      const userQuery = `
        INSERT INTO "User" (username, password)
        VALUES ($1, $2)
        RETURNING *
      `;
      const userValues = [username, password];

      const userResult = await this.dbProvider.query(userQuery, userValues);
      const newUser: User = userResult[0];
      await this.dbProvider.query('COMMIT');

      return newUser;
    } catch (error) {
      await this.dbProvider.query('ROLLBACK');
      throw error;
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    const query = `
      SELECT * FROM "User"
      WHERE username = $1
    `;
    const values = [username];

    try {
      const result = await this.dbProvider.query(query, values);
      const user: User | null = result[0] || null;
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserById(userId: string): Promise<User | null> {
    const query = `
      SELECT * FROM "User"
      WHERE id = $1
    `;
    const values = [userId];
    try {
      const result = await this.dbProvider.query(query, values);
      const user: User | null = result[0] || null;
      return user;
    } catch (error) {
      throw error;
    }
  }
}

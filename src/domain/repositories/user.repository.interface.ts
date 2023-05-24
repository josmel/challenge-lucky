import { User } from '../models/user.entity';

export interface UserRepository {
  createUser(username: string, password: string): Promise<User>;
  findByUsername(username: string): Promise<User>;
  findUserById(userId: string): Promise<User | null>;
}

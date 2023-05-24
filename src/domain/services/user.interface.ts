import { CreateUserDto } from 'src/api/dto/create.user.dto';
import { User } from '../models/user.entity';

export interface IUserService {
  registerUser(userDto: CreateUserDto): Promise<User>;
  login(username: string, password: string): Promise<string>;
  getUserProfile(userId: string): Promise<any>;
}

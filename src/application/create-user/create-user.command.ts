import { CreateUserDto } from 'src/api/dto/create.user.dto';

export class CreateUserCommand {
  constructor(public readonly createUserDto: CreateUserDto) {}
}

import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginCommand } from './login.command';
import { UserService } from '../../domain/services/user.service';

@Injectable()
@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(private readonly userService: UserService) {}

  async execute(command: LoginCommand): Promise<string> {
    const { username, password } = command;
    try {
      const token = await this.userService.login(username, password);
      return token;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid username or password');
    }
  }
}

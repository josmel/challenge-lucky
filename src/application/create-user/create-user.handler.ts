import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { UserService } from '../../domain/services/user.service';
import { CityRepository } from '../../domain/repositories/city.repository.interface';
import { CityNotFoundException } from '../../domain/exceptions/city-not-found.exception';
import { InjectionValue } from '../../infrastructure/d-injection/types';
import { Inject } from '@nestjs/common';
import { UserRepository } from '../../domain/repositories/user.repository.interface';
import { UserNameExistException } from '../../domain/exceptions/username-exist.exception';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly userService: UserService,
    @Inject(InjectionValue.CITY_REPOSITORY)
    private readonly cityRepository: CityRepository,
    @Inject(InjectionValue.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<void> {
    const { createUserDto } = command;
    const city = await this.cityRepository.findById(createUserDto.cityId);
    if (!city) throw new CityNotFoundException(createUserDto.cityId);

    const user = await this.userRepository.findByUsername(
      createUserDto.username,
    );
    if (user) throw new UserNameExistException(createUserDto.username);

    await this.userService.registerUser(createUserDto);
  }
}

import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto } from '../dto/create.user.dto';
import { CreateUserCommand } from '../../application/create-user/create-user.command';
import { CreateUserController } from './create.user.controller';

describe('CreateUserController', () => {
  let controller: CreateUserController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateUserController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CreateUserController>(CreateUserController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  describe('createUser', () => {
    it('should execute CreateUserCommand with the provided user DTO', async () => {
      const createUserDto: CreateUserDto = {
        username: 'john_doe',
        password: 'password123',
        name: 'John Doe',
        address: '123 Main St',
        cityId: '528de154-f857-11ed-b67e-0242ac120002',
      };
      const executeSpy = jest.spyOn(commandBus, 'execute');

      await controller.createUser(createUserDto);

      expect(executeSpy).toHaveBeenCalledWith(
        new CreateUserCommand(createUserDto),
      );
    });
  });
});

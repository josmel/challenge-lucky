import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthController } from './auth.controller';
import { LoginCommand } from '../../application/auth/login.command';
import { LoginDto } from '../dto/auth.dto';
describe('AuthController', () => {
  let controller: AuthController;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  describe('login', () => {
    it('should call execute method of CommandBus with LoginCommand', async () => {
      const username = 'testuser';
      const password = 'testpassword';
      const executeSpy = jest.spyOn(commandBus, 'execute');

      const LoginBodyDto: LoginDto = { username, password };
      await controller.login(LoginBodyDto);

      expect(executeSpy).toHaveBeenCalledWith(
        new LoginCommand(username, password),
      );
    });

    it('should return the result of CommandBus execute', async () => {
      const expectedResult = 'token';
      jest.spyOn(commandBus, 'execute').mockResolvedValue(expectedResult);

      const result = await controller.login({
        username: 'testuser',
        password: 'testpassword',
      });
      expect(result).toBe(expectedResult);
    });
  });
});

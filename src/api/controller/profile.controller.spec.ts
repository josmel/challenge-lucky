import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ProfileController } from './profile.controller';
describe('ProfileController', () => {
  let controller: ProfileController;
  let queryBus: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
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

    controller = module.get<ProfileController>(ProfileController);
    queryBus = module.get<QueryBus>(QueryBus);
  });

  describe('getUserProfile', () => {
    it('should throw UnauthorizedException if token is missing', async () => {
      const headers = { Authorization: undefined };

      await expect(
        controller.getUserProfile(headers.Authorization),
      ).rejects.toThrow('Missing token');
    });

    it('should call queryBus.execute with the correct query', async () => {
      const headers = { authorization: 'valid_token' };
      const queryResult = {
        userProfile: {
          id: '4543f8da-f857-11ed-b67e-0242ac120002',
          name: 'Juan Luis',
          address: {
            street: 'Dam square',
            city: 'Amsterdam',
            country: 'Netherlands',
          },
        },
      };

      jest.spyOn(queryBus, 'execute').mockResolvedValue(queryResult);

      const result = await controller.getUserProfile(headers.authorization);

      expect(queryBus.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          token: headers.authorization,
        }),
      );
      expect(result).toEqual(queryResult.userProfile);
    });
  });
});

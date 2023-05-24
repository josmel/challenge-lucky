import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserModule } from '../src/user.module';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserProfileQuery } from '../src/application/user-profile/get-user-profile.query';

describe('AuthController Profile (e2e)', () => {
  let app: INestApplication;
  let queryBus: QueryBus;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    queryBus = moduleFixture.get<QueryBus>(QueryBus);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/auth/profile', () => {
    it('should return user profile when a valid token is provided', async () => {
      const bodyGeneric = {
        id: '4543f8da-f857-11ed-b67e-0242ac120002',
        name: 'John Doe',
        address: {
          street: 'Dam square',
          city: 'Amsterdam',
          country: 'Netherlands',
        },
      };
      const executeSpy = jest.spyOn(queryBus, 'execute').mockResolvedValue({
        userProfile: bodyGeneric,
      });

      const loginResponse = await request(app.getHttpServer())
        .post('/api/v1/auth')
        .send({ username: 'john.doe', password: 'password' });

      const token = loginResponse.body.token;

      const response = await request(app.getHttpServer())
        .get('/api/v1/profile')
        .set('Authorization', `${token}`);

      expect(response.status).toBe(HttpStatus.OK);
      expect(response.body).toEqual(bodyGeneric);

      expect(executeSpy).toHaveBeenCalledWith(expect.any(GetUserProfileQuery));

      jest.clearAllMocks();
    });

    it('should return UnauthorizedException when no token is provided', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/v1/profile',
      );

      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.body.message).toBe('Missing token');
    });
  });
});

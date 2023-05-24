import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { HttpStatus } from '@nestjs/common';
import { UserModule } from '../src/user.module';
import { UserService } from '../src/domain/services/user.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;
  let moduleFixture: TestingModule;
  beforeAll(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    userService = moduleFixture.get<UserService>(UserService);
  });

  afterAll(async () => {
    await app.close();
    jest.restoreAllMocks();
  });

  it('/api/v1/auth (POST) - should return JWT token on successful login', async () => {
    jest.spyOn(userService, 'login').mockResolvedValue('mocked_token');

    const loginDto = { username: 'testuser', password: 'testpassword' };
    await request(app.getHttpServer())
      .post('/api/v1/auth')
      .send(loginDto)
      .expect(HttpStatus.CREATED);
    jest.restoreAllMocks();
  });

  it('/api/v1/auth (POST) - should return 401 status', () => {
    const loginDto = {
      username: 'errortestuser',
      password: 'errortestpassword',
    };

    return request(app.getHttpServer())
      .post('/api/v1/auth')
      .send(loginDto)
      .expect(HttpStatus.UNAUTHORIZED);
  });

  it('/api/v1/auth (POST) - should return 400 Bad Request on invalid login data', () => {
    const invalidLoginDto = { username: '', password: '' };

    return request(app.getHttpServer())
      .post('/api/v1/auth')
      .send(invalidLoginDto)
      .expect(HttpStatus.BAD_REQUEST);
  });
});

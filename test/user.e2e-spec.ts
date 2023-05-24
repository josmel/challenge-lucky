import { HttpStatus, INestApplication, HttpException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { SinonSandbox, createSandbox } from 'sinon';
import { CommandBus } from '@nestjs/cqrs';
import { UserModule } from '../src/user.module';
import { UserNameExistException } from '../src/domain/exceptions/username-exist.exception';

describe('CreateUserController (e2e)', () => {
  let app: INestApplication;
  let sandbox: SinonSandbox;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UserModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should return 201 for successful user creation', async () => {
    const createUserDto = {
      username: 'john_doe',
      password: 'password123',
      name: 'John Doe',
      address: '123 Main St',
      cityId: '528de154-f857-11ed-b67e-0242ac120002',
    };

    const executeSpy = sandbox.stub(CommandBus.prototype, 'execute');

    await executeSpy.resolves();

    const response = await request(app.getHttpServer())
      .post('/api/v1/create-user')
      .send(createUserDto)
      .expect(HttpStatus.CREATED);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(executeSpy.calledOnce).toBe(true);
  });

  it('should return 400 if validation fails', async () => {
    const createUserDto = {
      username: 'john_doe',
      password: 'password123',
      name: 'John Doe',
    };

    const executeSpy = sandbox.stub(CommandBus.prototype, 'execute');

    await executeSpy.throws(
      new HttpException('Validation failed', HttpStatus.BAD_REQUEST),
    );

    const response = await request(app.getHttpServer())
      .post('/api/v1/create-user')
      .send(createUserDto)
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
  });

  it('should return 409 if username already exists', async () => {
    const createUserDto = {
      username: 'john_doe',
      password: 'password123',
      name: 'John Doe',
      address: '123 Main St',
      cityId: '528de154-f857-11ed-b67e-0242ac120002',
    };
    const executeStub = sandbox.stub(CommandBus.prototype, 'execute');
    executeStub.throws(
      new UserNameExistException(
        `User ${createUserDto.username} already exists.`,
      ),
    );

    const response = await request(app.getHttpServer())
      .post('/api/v1/create-user')
      .send(createUserDto)
      .expect(HttpStatus.CONFLICT);

    expect(response.status).toBe(HttpStatus.CONFLICT);
  });
});

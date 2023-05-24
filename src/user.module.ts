import { Module, Provider } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserController } from './api/controller/create.user.controller';
import { UserService } from './domain/services/user.service';
import { CreateUserHandler } from './application/create-user/create-user.handler';
import { UserRepositoryImpl } from './infrastructure/repository/user.repository';
import { AddressRepositoryImpl } from './infrastructure/repository/address.repository';
import { ProfileRepositoryImpl } from './infrastructure/repository/profile.repository';
import { InjectionValue } from './infrastructure/d-injection/types';
import { ConfigModule } from '@nestjs/config';
import { DatabaseProvider } from './infrastructure/persistence/configs/database.provider';
import { JwtTokenService } from './infrastructure/security/jwt';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './api/controller/auth.controller';
import { LoginCommandHandler } from './application/auth/login-command.handler';
import { GetUserProfileHandler } from './application/user-profile/get-user-profile.handler';
import { CountryRepositoryImpl } from './infrastructure/repository/country.repository';
import { CityRepositoryImpl } from './infrastructure/repository/city.repository';
import { PasswordHasherService } from './infrastructure/services/password-hasher.service';
import { RedisRepository } from './infrastructure/cache/redis.repository';
import { ProfileController } from './api/controller/profile.controller';

const application = [
  CreateUserHandler,
  LoginCommandHandler,
  GetUserProfileHandler,
];
const domain = [];
const infrastructure: Provider[] = [
  {
    provide: InjectionValue.USER_REPOSITORY,
    useClass: UserRepositoryImpl,
  },
  {
    provide: InjectionValue.ADDRESS_REPOSITORY,
    useClass: AddressRepositoryImpl,
  },
  {
    provide: InjectionValue.PROFILE_REPOSITORY,
    useClass: ProfileRepositoryImpl,
  },
  {
    provide: InjectionValue.CITY_REPOSITORY,
    useClass: CityRepositoryImpl,
  },
  {
    provide: InjectionValue.COUNTRY_REPOSITORY,
    useClass: CountryRepositoryImpl,
  },
  {
    provide: InjectionValue.SECURITY,
    useClass: JwtTokenService,
  },
  {
    provide: InjectionValue.BCRYPT,
    useClass: PasswordHasherService,
  },
  {
    provide: InjectionValue.CACHE,
    useClass: RedisRepository,
  },
];

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [CreateUserController, AuthController, ProfileController],
  providers: [
    UserService,
    DatabaseProvider,
    ...infrastructure,
    ...application,
    ...domain,
  ],
  exports: [UserService],
})
export class UserModule {}

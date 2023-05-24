import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository.interface';
import { CreateUserDto } from 'src/api/dto/create.user.dto';
import { User } from '../models/user.entity';
import { AddressRepository } from '../repositories/address.repository.interface';
import { ProfileRepository } from '../repositories/profile.repository.interface';
import { IUserService } from './user.interface';
import { InjectionValue } from '../../infrastructure/d-injection/types';
import { SecurityJwt } from '../ports/jwt.interface';
import { UserProfile } from '../../application/user-profile/user-profile';
import { CityRepository } from '../repositories/city.repository.interface';
import { CountryRepository } from '../repositories/country.repository.interface';
import { IPasswordHasher } from '../ports/password-hasher.interface';
import { CacheRepository } from '../ports/cache.repository.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(InjectionValue.USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(InjectionValue.ADDRESS_REPOSITORY)
    private readonly addressRepository: AddressRepository,
    @Inject(InjectionValue.PROFILE_REPOSITORY)
    private readonly profileRepository: ProfileRepository,

    @Inject(InjectionValue.CITY_REPOSITORY)
    private readonly cityRepository: CityRepository,

    @Inject(InjectionValue.COUNTRY_REPOSITORY)
    private readonly countryRepository: CountryRepository,

    @Inject(InjectionValue.SECURITY)
    private readonly jwtTokenService: SecurityJwt,
    @Inject(InjectionValue.BCRYPT)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(InjectionValue.CACHE)
    private readonly cacheRepository: CacheRepository,
  ) {}

  async registerUser(userDto: CreateUserDto): Promise<User> {
    const { username, password, name, address, cityId } = userDto;

    const addressId = await this.addressRepository.createAddress(
      address,
      cityId,
    );

    const hashedPassword = await this.passwordHasher.hashPassword(password);
    const newUser = await this.userRepository.createUser(
      username,
      hashedPassword,
    );

    await this.profileRepository.createProfile(newUser.id, addressId, name);

    return newUser;
  }

  async login(username: string, password: string): Promise<string | any> {
    const cachedToken = await this.cacheRepository.get(username);
    if (cachedToken) {
      return cachedToken;
    }
    const user = await this.userRepository.findByUsername(username);
    if (!user) {
      throw new Error('Invalid username or password');
    }
    const isPasswordValid = await this.passwordHasher.comparePasswords(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }

    const token = this.jwtTokenService.sign({
      username: user.username,
      userid: user.id,
    });
    await this.cacheRepository.set(username, await token);
    return token;
  }

  async getUserProfile(userId: string): Promise<UserProfile> {
    const cachedProfile = await this.cacheRepository.get(
      `user-profile:${userId}`,
    );
    if (cachedProfile) {
      return cachedProfile;
    }
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const profile = await this.profileRepository.findAddressIdByUserId(user.id);
    if (!profile) {
      throw new NotFoundException('profile not found');
    }
    const address = await this.addressRepository.findAddressById(
      profile.addressid,
    );
    if (!address) {
      throw new NotFoundException('Address not found');
    }

    const city = await this.cityRepository.findById(address.cityid);
    if (!city) {
      throw new NotFoundException('City not found');
    }

    const country = await this.countryRepository.findById(city.countryid);
    if (!country) {
      throw new NotFoundException('Country not found');
    }

    const userProfile = new UserProfile(user.id, profile.name, {
      street: address.street,
      city: city.name,
      country: country.name,
    });

    await this.cacheRepository.set(`user-profile:${userId}`, userProfile);

    return userProfile;
  }
}

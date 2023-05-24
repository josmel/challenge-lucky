import {
  Body,
  Controller,
  Post,
  UsePipes,
  Get,
  Headers,
  UnauthorizedException,
  UseGuards,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { UserProfile } from '../../application/user-profile/user-profile';
import { GetUserProfileQueryResult } from 'src/application/user-profile/get-user-profile.query.result';
import { GetUserProfileQuery } from '../../application/user-profile/get-user-profile.query';
import { ValidationPipe } from '../../infrastructure/validation/validation.pipe';

@ApiTags('profile')
@UseGuards()
@Controller('/api/v1/profile')
export class ProfileController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('')
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOkResponse()
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  async getUserProfile(
    @Headers('Authorization') token: string,
  ): Promise<UserProfile> {
    if (!token) {
      throw new HttpException('Missing token', HttpStatus.UNAUTHORIZED);
    }
    const queryResult: GetUserProfileQueryResult = await this.queryBus.execute(
      new GetUserProfileQuery(token),
    );
    return queryResult.userProfile;
  }
}

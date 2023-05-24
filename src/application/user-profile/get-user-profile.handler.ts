import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { UserService } from '../../domain/services/user.service';
import { GetUserProfileQuery } from './get-user-profile.query';
import { GetUserProfileQueryResult } from './get-user-profile.query.result';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { InjectionValue } from '../../infrastructure/d-injection/types';
import { SecurityJwt } from '../../domain/ports/jwt.interface';

@QueryHandler(GetUserProfileQuery)
export class GetUserProfileHandler
  implements IQueryHandler<GetUserProfileQuery, GetUserProfileQueryResult>
{
  constructor(
    private readonly userService: UserService,
    @Inject(InjectionValue.SECURITY)
    private readonly tokenDecoderService: SecurityJwt,
  ) {}

  async execute(
    query: GetUserProfileQuery,
  ): Promise<GetUserProfileQueryResult> {
    const { token } = query;

    const decodedToken = this.tokenDecoderService.verify(token);
    const userid = decodedToken?.userid || null;
    if (!userid) {
      throw new UnauthorizedException('Invalid token');
    }

    const userProfile = await this.userService.getUserProfile(userid);
    return new GetUserProfileQueryResult(userProfile);
  }
}

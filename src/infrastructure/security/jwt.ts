import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SecurityJwt, UserInfo } from 'src/domain/ports/jwt.interface';

@Injectable()
export class JwtTokenService implements SecurityJwt {
  constructor(private readonly jwtService: JwtService) {}

  /**
   * Sign the information and return a token
   * @param data
   * @returns <string | any>
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async sign(data: any, ttl?: number): Promise<string | object> {
    const payload = data;
    const token = this.jwtService.sign(payload);
    return token;
  }

  /**
   * Verify the token
   * @param token
   * @returns <string | any>
   */
  verify(token: string): UserInfo {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return error;
    }
  }
}

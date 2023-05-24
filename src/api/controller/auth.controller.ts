import {
  Body,
  Controller,
  Post,
  UsePipes,
  Get,
  Headers,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ResponseDescription } from './response-description';
import {
  ApiTags,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { LoginCommand } from '../../application/auth/login.command';
import { LoginDto } from '../dto/auth.dto';
import { ValidationPipe } from '../../infrastructure/validation/validation.pipe';

@ApiTags('auth')
@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  @UsePipes(new ValidationPipe())
  async login(@Body() body: LoginDto): Promise<string> {
    const { username, password } = body;
    const command = new LoginCommand(username, password);
    return await this.commandBus.execute(command);
  }
}

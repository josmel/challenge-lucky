import { ResponseDescription } from './response-description';
import {
  Controller,
  Post,
  Body,
  UsePipes,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiTags,
  ApiResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../dto/create.user.dto';
import { HttpStatus } from '@nestjs/common';
import { CreateUserCommand } from '../../application/create-user/create-user.command';
import { ValidationPipe } from '../../infrastructure/validation/validation.pipe';
import { CityNotFoundException } from '../../domain/exceptions/city-not-found.exception';
import { UserNameExistException } from '../../domain/exceptions/username-exist.exception';

@ApiTags('users')
@Controller('/api/v1/create-user')
export class CreateUserController {
  constructor(private readonly commandBus: CommandBus) {}
  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: ResponseDescription.CREATED,
  })
  @ApiBadRequestResponse({ description: ResponseDescription.BAD_REQUEST })
  @ApiInternalServerErrorResponse({
    description: ResponseDescription.INTERNAL_SERVER_ERROR,
  })
  @ApiNotFoundResponse({ description: ResponseDescription.NOT_FOUND })
  @UsePipes(new ValidationPipe())
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    try {
      await this.commandBus.execute(new CreateUserCommand(createUserDto));
    } catch (error) {
      if (error instanceof CityNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else if (error instanceof UserNameExistException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      } else if (error instanceof NotFoundException) {
        throw new HttpException(
          ResponseDescription.NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw new HttpException(
          ResponseDescription.INTERNAL_SERVER_ERROR,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}

// users.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { UserResponse } from './interfaces/user-response.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async register(@Body() dto: UserDto): Promise<string> {
    await this.usersService.register(dto);
    return 'User registered successfully';
  }

  @Post('login')
  async login(
    @Body() dto: { email: string; password: string },
  ): Promise<UserResponse> {
    const user = await this.usersService.validateUser(dto.email, dto.password);
    if (!user || !user.isVerified)
      throw new UnauthorizedException('Invalid email or password');

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserResponse | null> {
    const user = await this.usersService.findById(id);
    if (!user || !user.isVerified) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}

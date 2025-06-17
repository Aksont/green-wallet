import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { TripsService } from './trips.service';
import { Trip } from './interfaces/trip.interface';
import { CreateTripDto } from './dto/create-trip.dto';
import { UsersService } from 'src/users/users.service';

@Controller('trips')
export class TripsController {
  constructor(
    private readonly tripsService: TripsService,
    private readonly usersService: UsersService,
  ) {}

  // @Get()
  // findAll(): Trip[] {
  //   return this.tripsService.findAll();
  // }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Trip> {
    const trip = await this.tripsService.findById(id);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${id} not found`);
    }
    return trip;
  }

  @Post('multiple')
  async findByIds(@Body('ids') ids: string[]): Promise<Trip[]> {
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      throw new NotFoundException('No trip IDs provided');
    }

    const trips = await this.tripsService.findByIds(ids);

    return trips;
  }

  @Get('for-user/:userId')
  async findForUser(@Param('userId') userId: string): Promise<Trip[]> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.isVerified) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    } // TODO implement real verification

    return this.tripsService.findUserTrips(userId);
  }

  @Post()
  async create(@Body() dto: CreateTripDto): Promise<Trip> {
    const user = await this.usersService.findById(dto.userId);
    if (!user || !user.isVerified) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    } // TODO implement real verification
    return this.tripsService.create(dto);
  }

  @Get('user-name/:tripId')
  async findUserName(@Param('tripId') tripId: string): Promise<string> {
    const trip = await this.tripsService.findById(tripId);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${tripId} not found`);
    }
    const user = await this.usersService.findById(trip.userId);
    if (!user || !user.isVerified) {
      throw new NotFoundException(`User with ID ${trip.userId} not found`);
    } // TODO implement real verification

    return user.name;
  }
}

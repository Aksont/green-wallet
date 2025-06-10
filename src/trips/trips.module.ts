import { Module } from '@nestjs/common';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Trip, TripSchema } from './schemas/trip.schema';
import { TripsRepository } from './trips.repository';

@Module({
  controllers: [TripsController],
  providers: [TripsService, TripsRepository],
  exports: [TripsService],
  imports: [
    UsersModule,
    MongooseModule.forFeature([{ name: Trip.name, schema: TripSchema }]),
  ],
})
export class TripsModule {}

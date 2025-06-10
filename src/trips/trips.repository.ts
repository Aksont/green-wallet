import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Trip, TripDocument } from './schemas/trip.schema';

@Injectable()
export class TripsRepository {
  constructor(@InjectModel(Trip.name) private model: Model<TripDocument>) {}

  async findById(id: string): Promise<Trip | null> {
    return this.model.findOne({ id }).exec();
  }

  async findByUserId(userId: string): Promise<Trip[]> {
    return this.model.find({ userId }).exec();
  }

  async create(tripData: Partial<Trip>): Promise<Trip> {
    const _new = new this.model(tripData);
    return _new.save();
  }
}

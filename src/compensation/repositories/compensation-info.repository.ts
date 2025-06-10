import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CompensationInfo,
  CompensationInfoDocument,
} from '../schemas/compensation-info.schema';

@Injectable()
export class CompensationInfosRepository {
  constructor(
    @InjectModel(CompensationInfo.name)
    private model: Model<CompensationInfoDocument>,
  ) {}

  async findById(id: string): Promise<CompensationInfo | null> {
    return this.model.findOne({ id }).exec();
  }

  async findByTripId(tripId: string): Promise<CompensationInfo[]> {
    return this.model.find({ tripId }).exec();
  }

  async findByUserId(userId: string): Promise<CompensationInfo[]> {
    return this.model.find({ userId }).exec();
  }

  async create(data: Partial<CompensationInfo>): Promise<CompensationInfo> {
    const _new = new this.model(data);
    return _new.save();
  }
}

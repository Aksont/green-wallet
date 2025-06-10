import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ProofOfCompensation,
  ProofOfCompensationDocument,
} from '../schemas/proof-of-compensation.schema';

@Injectable()
export class ProofOfCompensationsRepository {
  constructor(
    @InjectModel(ProofOfCompensation.name)
    private model: Model<ProofOfCompensationDocument>,
  ) {}

  async findByTripId(tripId: string): Promise<ProofOfCompensation | null> {
    return this.model.findOne({ tripId }).exec();
  }

  async findByUserId(userId: string): Promise<ProofOfCompensation[]> {
    return this.model.find({ userId }).exec();
  }

  async create(
    data: Partial<ProofOfCompensation>,
  ): Promise<ProofOfCompensation> {
    const _new = new this.model(data);
    return _new.save();
  }
}

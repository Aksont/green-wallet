import { Module } from '@nestjs/common';
import { CompensationController } from './compensation.controller';
import { CompensationService } from './compensation.service';
import { ProjectsModule } from 'src/projects/projects.module';
import { TripsModule } from 'src/trips/trips.module';
import { UsersModule } from 'src/users/users.module';
import {
  CompensationInfo,
  CompensationInfoSchema,
} from './schemas/compensation-info.schema';
import {
  ProofOfCompensation,
  ProofOfCompensationSchema,
} from './schemas/proof-of-compensation.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ProofOfCompensationsRepository } from './repositories/proof-of-compensation.repository';
import { CompensationInfosRepository } from './repositories/compensation-info.repository';

@Module({
  controllers: [CompensationController],
  providers: [
    CompensationService,
    ProofOfCompensationsRepository,
    CompensationInfosRepository,
  ],
  imports: [
    ProjectsModule,
    TripsModule,
    UsersModule,
    MongooseModule.forFeature([
      { name: CompensationInfo.name, schema: CompensationInfoSchema },
      { name: ProofOfCompensation.name, schema: ProofOfCompensationSchema },
    ]),
  ],
})
export class CompensationModule {}

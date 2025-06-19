import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { CompensationSuggestions } from 'src/trips/interfaces/compensation-suggestions.interface';
import { CompensationService } from './compensation.service';
import { CompensationDto } from './dto/compensation-donation.dto';
import { CompensationInfo } from './interfaces/compensation-info.interface';
import { ProofOfCompensation } from './interfaces/proof-of-compensation.interface';
import { UsersService } from 'src/users/users.service';
import { UserStats } from './interfaces/user-stats.interface';
import { TripsService } from 'src/trips/trips.service';
import { ProjectsService } from 'src/projects/projects.service';
import {
  claimProofToUser,
  getTokenId,
} from './blockchain/compensation.blockchain';

@Controller('compensation')
export class CompensationController {
  constructor(
    private readonly compensationService: CompensationService,
    private readonly usersService: UsersService,
    private readonly tripsService: TripsService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get('/user-proofs/:userId')
  async findUserProofs(
    @Param('userId') userId: string,
  ): Promise<ProofOfCompensation[]> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.isVerified) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    } // TODO implement real verification

    return await this.compensationService.findUserProofs(userId);
  }

  @Get('/proofs/:tripId')
  async findProof(
    @Param('tripId') tripId: string,
  ): Promise<ProofOfCompensation | undefined> {
    const proof = await this.compensationService.findProof(tripId);
    if (!proof)
      throw new NotFoundException(
        `Compensation proof not found for trip with id ${tripId}`,
      );
    return proof;
  }

  @Get('/is-compensated/:tripId')
  async isCompensated(@Param('tripId') tripId: string): Promise<boolean> {
    const proof = await this.compensationService.findProof(tripId);
    if (proof) {
      return true;
    }
    return false;
  }

  @Get('/suggestions/:tripId')
  async findCompensationSuggestionsForTrip(
    @Param('tripId') tripId: string,
  ): Promise<CompensationSuggestions> {
    return await this.compensationService.createCompensationSuggestions(tripId);
  }

  // TODO
  // @Get('/suggestions/:tripId')
  // getAmountLeftToCompensate(
  //   @Param('tripId') tripId: string,
  // ): CompensationSuggestions {
  //   return this.compensationService.createCompensationSuggestions(tripId);
  // }

  @Post('/donate')
  async donateToProject(
    @Body() dto: CompensationDto,
  ): Promise<CompensationInfo> {
    const user = await this.usersService.findById(dto.userId);
    if (!user || !user.isVerified) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    } // TODO implement real verification
    const trip = await this.tripsService.findById(dto.tripId);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${dto.tripId} not found`);
    }
    if (trip.userId !== dto.userId) {
      throw new ConflictException(
        `User with ID ${dto.userId} is not the owner of trip with id ${dto.tripId}`,
      );
    }
    const project = await this.projectsService.findById(dto.projectId);
    if (!project) {
      throw new NotFoundException(`Project with ID ${dto.projectId} not found`);
    }

    const info = await this.compensationService.donateToProject(dto);

    if (info.remainingCo2Compensation === 0) {
      await this.compensationService.issueProofOfCompensatedTravel(
        dto.tripId,
        dto.userId,
      );
    }

    return info;
  }

  @Get('stats/:userId')
  async getUserStats(@Param('userId') userId: string): Promise<UserStats> {
    const user = await this.usersService.findById(userId);
    if (!user || !user.isVerified) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    } // TODO implement real verification

    return this.compensationService.getUserStats(userId);
  }

  @Post('claim')
  async claimProof(@Body() body: { tripId: string; userAddress: string }) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-assignment
    const hx = await claimProofToUser(body.tripId, body.userAddress);
    console.log(hx);
    const updated = await this.compensationService.claim(body.tripId);
    console.log(updated);
  }

  @Get('token/:tripId')
  async getTokenId(@Param('tripId') tripId: string): Promise<number> {
    const trip = await this.tripsService.findById(tripId);
    if (!trip) {
      throw new NotFoundException(`Trip with ID ${tripId} not found`);
    }

    return getTokenId(tripId);
  }
}

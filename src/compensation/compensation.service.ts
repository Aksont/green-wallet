import { Injectable, NotFoundException } from '@nestjs/common';
import { ProjectType } from 'src/projects/enums/project-type.enum';
import {
  Challenge,
  DonationProject,
  VolunteerProject,
} from 'src/projects/interfaces/project.interface';
import { ProjectsService } from 'src/projects/projects.service';
import { CompensationSuggestions } from 'src/trips/interfaces/compensation-suggestions.interface';
import { Trip } from 'src/trips/interfaces/trip.interface';
import { TripsService } from 'src/trips/trips.service';
import { CompensationDto } from './dto/compensation-donation.dto';
import { CompensationInfo } from './interfaces/compensation-info.interface';
import { v4 as uuid } from 'uuid';
import { ProofOfCompensation } from './interfaces/proof-of-compensation.interface';
import { ProofOfCompensationStatus } from './enums/proof-of-compensation-status.interface';
import { ProofOfCompensationsRepository } from './repositories/proof-of-compensation.repository';
import { CompensationInfosRepository } from './repositories/compensation-info.repository';
import { issueProofToChain } from './blockchain/compensation.blockchain';

@Injectable()
export class CompensationService {
  MAX_NUMBER_OF_SUGGESTED_PROJECTS = 3;
  ONE_TREE_WORTH_OF_CO2 = 225; // TODO find source/reference
  ONE_VOLUNTEER_H_WORTH_OF_CO2 = 35; // TODO find source/reference

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tripsService: TripsService,
    private proofRepository: ProofOfCompensationsRepository,
    private infosRepository: CompensationInfosRepository,
  ) {}

  async createCompensationSuggestions(
    tripId: string,
  ): Promise<CompensationSuggestions> {
    const trip = await this.findTrip(tripId);
    const countries = this.collectCountries(trip);
    let projects = await this.projectsService.findProjects(
      Array.from(countries),
    );

    if (projects.length === 0) {
      projects = await this.projectsService.findAll();
    }

    const donationProjects = projects.filter(
      (p): p is DonationProject => p.type === ProjectType.DONATION,
    );
    const volunteerProjects = projects.filter(
      (p): p is VolunteerProject => p.type === ProjectType.VOLUNTEER,
    );
    const challenges = projects.filter(
      (p): p is Challenge => p.type === ProjectType.CHALLENGE,
    );

    return {
      trees: Math.ceil(trip.totalCo2emissionInKg / this.ONE_TREE_WORTH_OF_CO2),
      volunteerHours: Math.ceil(
        trip.totalCo2emissionInKg / this.ONE_VOLUNTEER_H_WORTH_OF_CO2,
      ),
      donationProjects: donationProjects
        .sort(() => 0.5 - Math.random())
        .slice(0, this.MAX_NUMBER_OF_SUGGESTED_PROJECTS), // randomly picks 3 selectProjects()
      volunteerProjects: volunteerProjects
        .sort(() => 0.5 - Math.random())
        .slice(0, this.MAX_NUMBER_OF_SUGGESTED_PROJECTS), // randomly picks 3 selectProjects()
      challenges: challenges.sort(() => 0.5 - Math.random()).slice(0, 1), // randomly picks 1
    };
  }

  // Not being used because of Project interface incompatibility with extended types
  // private selectProjects(projects: Project[], n: number): Project[] {
  //   // IDEA here can be smarter logic, based on how new or popular is the project, how relevant to user's goals, etc.
  //   // for volunteering projects especially important the proximity
  //   // (later additional filters based on popularity, funding, progres, newity, etc.)
  //   const shuffled = projects.sort(() => 0.5 - Math.random());
  //   return shuffled.slice(0, n);
  // }

  private collectCountries(trip: Trip): Set<string> {
    const countries = new Set([trip.from.country, trip.to.country]);
    for (const sequence of trip.sequences) {
      countries.add(sequence.to.country);
    }
    for (const sequence of trip.sequences) {
      countries.add(sequence.to.country);
    }

    return countries;
  }

  async donateToProject(dto: CompensationDto): Promise<CompensationInfo> {
    const trip = await this.findTrip(dto.tripId);
    const project = await this.projectsService.findById(dto.projectId);
    const currentRemainingComp =
      trip.totalCo2emissionInKg -
      (await this.calculateAlreadyCompensatedForTrip(dto.tripId));

    const thisCompensation =
      project?.type === ProjectType.DONATION
        ? dto.amount * this.ONE_TREE_WORTH_OF_CO2
        : dto.amount * this.ONE_VOLUNTEER_H_WORTH_OF_CO2;
    const nowCompensatedCo2 = Math.min(currentRemainingComp, thisCompensation);

    const compensationInfo = {
      id: uuid(),
      userId: dto.userId,
      tripId: dto.tripId,
      projectId: dto.projectId,
      date: new Date(),
      donation:
        project?.type === ProjectType.DONATION
          ? {
              trees: dto.amount,
              unitPrice: (project as DonationProject).unitPrice,
              totalPrice: dto.amount * (project as DonationProject).unitPrice,
              currency: (project as DonationProject).currency,
            }
          : undefined,
      volunteering:
        project?.type === ProjectType.VOLUNTEER
          ? {
              hours: dto.amount,
            }
          : undefined,
      compensatedCo2: nowCompensatedCo2,
      remainingCo2Compensation: currentRemainingComp - nowCompensatedCo2,
    };

    return await this.infosRepository.create(compensationInfo);
  }

  private async calculateAlreadyCompensatedForTrip(
    tripId: string,
  ): Promise<number> {
    const infos = await this.infosRepository.findByTripId(tripId);
    return infos.reduce((sum, info) => sum + info.compensatedCo2, 0);
  }

  private async findTrip(tripId: string): Promise<Trip> {
    const trip = await this.tripsService.findById(tripId);

    if (!trip) {
      throw new NotFoundException(`Trip with id ${tripId} not found`);
    }

    return trip;
  }

  async issueProofOfCompensatedTravel(
    tripId: string,
    userId: string,
  ): Promise<ProofOfCompensation> {
    const tripInfos = await this.infosRepository.findByTripId(tripId);
    const donationInfos = tripInfos.filter(
      (info) => info.donation !== undefined,
    );
    const volunteeringInfos = tripInfos.filter(
      (info) => info.volunteering !== undefined,
    );
    const proof = {
      tripId: tripId,
      userId: userId,
      trees: donationInfos.reduce((sum, info) => sum + info.donation!.trees, 0),
      volunteerHours: volunteeringInfos.reduce(
        (sum, info) => sum + info.volunteering!.hours,
        0,
      ),
      donationInfos,
      volunteeringInfos,
      comment: 'I felt happy to be able to compensate for my necessary trip!',
      status: ProofOfCompensationStatus.APPROVED,
    };

    const trip = await this.tripsService.findById(tripId);
    await issueProofToChain(
      tripId,
      trip?.totalCo2emissionInKg || 0,
      trip?.totalDistanceInKm || 0,
      proof.trees,
      proof.volunteerHours,
    );

    return await this.proofRepository.create(proof);
  }

  async findProof(tripId: string): Promise<ProofOfCompensation | null> {
    return await this.proofRepository.findByTripId(tripId);
  }

  async findUserProofs(userId: string): Promise<ProofOfCompensation[]> {
    return await this.proofRepository.findByUserId(userId);
  }

  async findUserInfos(userId: string): Promise<CompensationInfo[]> {
    return await this.infosRepository.findByUserId(userId);
  }

  async getUserStats(id: string) {
    const trips = await this.tripsService.findUserTrips(id);
    const proofs = await this.findUserProofs(id);
    const infos = await this.findUserInfos(id);
    const totalCo2 = trips.reduce((sum, trip) => {
      return sum + (trip.totalCo2emissionInKg ?? 0);
    }, 0);
    const totalKm = trips.reduce((sum, trip) => {
      return sum + (trip.totalDistanceInKm ?? 0);
    }, 0);

    return {
      userId: id,
      trees: infos.reduce((sum, info) => {
        return sum + (info.donation?.trees ?? 0);
      }, 0),
      hours: infos.reduce((sum, info) => {
        return sum + (info.volunteering?.hours ?? 0);
      }, 0),
      totalCo2: totalCo2,
      compensatedCo2: infos.reduce((sum, info) => {
        return sum + (info.compensatedCo2 ?? 0);
      }, 0),
      averageCo2PerKm: totalCo2 / totalKm,
      totalTrips: trips.length,
      compensatedTrips: proofs.length,
    };
  }

  async claim(tripId: string): Promise<ProofOfCompensation | null> {
    return await this.proofRepository.claim(tripId);
  }
}

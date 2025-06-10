import { Injectable } from '@nestjs/common';
import { validateEndDateAfterOrEqualStartDate } from 'src/utils/validate-dates';
import { Trip } from './interfaces/trip.interface';
import { CreateTripDto } from './dto/create-trip.dto';
import { v4 as uuid } from 'uuid';
import { CreateSequenceDto } from './dto/create-sequence.dto';
import { Sequence } from './interfaces/sequence.interface';
import { getDistanceKm } from './third-party-api-services/getDistance';
import { TransportType } from 'src/trips/enums/transport-type.enum';
import { Location } from './interfaces/location.interface';
import { getFlightCo2 } from './third-party-api-services/getFlightCo2';
import { getCarCo2 } from './third-party-api-services/getCarCo2';
import { TripsRepository } from './trips.repository';

@Injectable()
export class TripsService {
  CO2_EMISSION_IN_G_PER_PKM_BUS = 36;
  CO2_EMISSION_IN_G_PER_PKM_TRAIN = 14;

  constructor(private tripsRepo: TripsRepository) {}

  // private trips: Trip[] = [
  //   {
  //     id: '532bd9d0-76f8-4c40-8b79-3c13d7f2cdae',
  //     userId: '70d81692-2aa6-4651-bfb0-ff965a4377e7',
  //     title: 'Weekend Getaway',
  //     from: {
  //       name: 'Amsterdam',
  //       country: 'Netherlands',
  //       showName: 'Amsterdam, Netherlands',
  //     },
  //     to: {
  //       name: 'Paris',
  //       country: 'France',
  //       showName: 'Paris, France',
  //     },
  //     startDate: new Date('2025-07-18T00:00:00.000Z'),
  //     endDate: new Date('2025-07-20T00:00:00.000Z'),
  //     sequences: [
  //       {
  //         from: {
  //           name: 'Amsterdam',
  //           country: 'Netherlands',
  //           showName: 'Amsterdam, Netherlands',
  //         },
  //         to: {
  //           name: 'Brussels',
  //           country: 'Belgium',
  //           showName: 'Brussels, Belgium',
  //         },
  //         date: new Date('2025-07-18T00:00:00.000Z'),
  //         transportType: TransportType.TRAIN,
  //         distanceInKm: 209.792,
  //         co2emissionInKg: 2.937088,
  //         numOfPassangers: 1,
  //       },
  //       {
  //         from: {
  //           name: 'Brussels',
  //           country: 'Belgium',
  //           showName: 'Brussels, Belgium',
  //         },
  //         to: {
  //           name: 'Paris',
  //           country: 'France',
  //           showName: 'Paris, France',
  //         },
  //         date: new Date('2025-07-18T00:00:00.000Z'),
  //         transportType: TransportType.BUS,
  //         distanceInKm: 307.579,
  //         co2emissionInKg: 11.072844000000002,
  //         numOfPassangers: 1,
  //       },
  //     ],
  //     returnSequences: [
  //       {
  //         from: {
  //           name: 'Paris',
  //           country: 'France',
  //           showName: 'Paris, France',
  //         },
  //         to: {
  //           name: 'Brussels',
  //           country: 'Belgium',
  //           showName: 'Brussels, Belgium',
  //         },
  //         date: new Date('2025-07-20T00:00:00.000Z'),
  //         transportType: TransportType.WALK,
  //         distanceInKm: 312.095,
  //         co2emissionInKg: 1000,
  //         numOfPassangers: 1,
  //       },
  //       {
  //         from: {
  //           name: 'Brussels',
  //           country: 'Belgium',
  //           showName: 'Brussels, Belgium',
  //         },
  //         to: {
  //           name: 'Amsterdam',
  //           country: 'Netherlands',
  //           showName: 'Amsterdam, Netherlands',
  //         },
  //         date: new Date('2025-07-18T00:00:00.000Z'),
  //         transportType: TransportType.BICYCLE,
  //         distanceInKm: 10,
  //         co2emissionInKg: 0,
  //         numOfPassangers: 1,
  //       },
  //     ],
  //     // eslint-disable-next-line no-loss-of-precision
  //     totalCo2emissionInKg: 1014.009932000000003,
  //     totalDistanceInKm: 839.466,
  //   },
  // ];

  async findById(id: string): Promise<Trip | null> {
    return await this.tripsRepo.findById(id);
  }

  async create(dto: CreateTripDto): Promise<Trip> {
    validateEndDateAfterOrEqualStartDate(dto.startDate, dto.endDate);
    const trip = this.createTrip(dto);
    await this.estimateTrip(trip);
    // trip.compensationSuggestions = this.createCompensationSuggestions(trip); // TODO move this into a controller later, no need to be invoced at the same time like all these mechanisms
    // this.trips.push(trip);
    return await this.tripsRepo.create(trip);
  }

  private async estimateTrip(trip: Trip): Promise<void> {
    // IDEA: nudge idea, put categories for distances such as < 200km
    // < 500, < 1000, < 2000 and tell people, "your trip falls under 10% of the best/worst trips in terms
    // of co2 emissions per kilometer of the users reported for the category < 1000"
    for (const sequence of trip.sequences) {
      await this.estimateSequence(sequence);
      trip.totalDistanceInKm += sequence.distanceInKm;
      trip.totalCo2emissionInKg += sequence.co2emissionInKg;
    }
    for (const sequence of trip.returnSequences ?? []) {
      await this.estimateSequence(sequence);
      trip.totalDistanceInKm += sequence.distanceInKm;
      trip.totalCo2emissionInKg += sequence.co2emissionInKg;
    }
  }

  private async estimateSequence(sequence: Sequence): Promise<void> {
    const origin = this.formLocationString(
      sequence.from,
      sequence.transportType,
    );
    const destination = this.formLocationString(
      sequence.to,
      sequence.transportType,
    );
    if (sequence.transportType == TransportType.FLIGHT) {
      const res = await getFlightCo2(origin, destination);
      sequence.distanceInKm = res.distanceInKm;
      sequence.co2emissionInKg = res.co2emissionInKg;
    } else if (
      sequence.transportType == TransportType.WALK ||
      sequence.transportType == TransportType.BICYCLE
    ) {
      if (sequence.distanceInKm === 0) {
        sequence.distanceInKm = await getDistanceKm(origin, destination);
      }
    } else {
      sequence.distanceInKm = await getDistanceKm(origin, destination);

      if (
        sequence.transportType == TransportType.CAR &&
        'numOfPassangers' in sequence
      ) {
        const numOfPassangers = sequence.numOfPassangers
          ? sequence.numOfPassangers
          : 1;
        sequence.co2emissionInKg =
          (await getCarCo2(sequence.distanceInKm)) / numOfPassangers; // TODO call Carbon Interface API with a default car AND divide by number of passangers (that we don't have yet in the data type)
      } else if (sequence.transportType == TransportType.BUS) {
        sequence.co2emissionInKg =
          (sequence.distanceInKm * this.CO2_EMISSION_IN_G_PER_PKM_BUS) / 1000;
      } else if (sequence.transportType == TransportType.TRAIN) {
        sequence.co2emissionInKg =
          (sequence.distanceInKm * this.CO2_EMISSION_IN_G_PER_PKM_TRAIN) / 1000;
      }
      //TODO possible to put all sequences in just max 3 requests to outer services - combine all distance reqs for Google Maps API
      // combine all flights, combine all cars -> no need to go sequence by sequence, when it can be done all together
    }
  }

  private formLocationString(
    location: Location,
    transportType: TransportType,
  ): string {
    if (transportType == TransportType.FLIGHT && 'iata' in location) {
      return location.iata!;
    } else {
      return location.name.concat(',').concat(location.country);
    }
  }

  private createTrip(dto: CreateTripDto): Trip {
    //TODO validate data

    return {
      id: uuid(),
      userId: dto.userId,
      title: dto.title,
      from: dto.from,
      to: dto.to,
      startDate: new Date(dto.startDate),
      endDate: new Date(dto.endDate),
      sequences: dto.sequences.map((s) => this.createSequence(s)),
      returnSequences: (dto.returnSequences ?? []).map((s) =>
        this.createSequence(s),
      ),
      totalCo2emissionInKg: 0,
      totalDistanceInKm: 0,
    };
  }

  private createSequence(dto: CreateSequenceDto): Sequence {
    //TODO validate data
    // let from: Location, to: Location;
    const numOfPassangers =
      dto.numOfPassangers && dto.transportType === TransportType.CAR
        ? dto.numOfPassangers
        : 1; // validate in range 1 to 5
    const distance =
      dto.distance &&
      (dto.transportType === TransportType.WALK ||
        dto.transportType === TransportType.BICYCLE)
        ? dto.distance
        : 0; // validate not negative

    return {
      from: dto.from,
      to: dto.to,
      date: new Date(dto.date),
      transportType: dto.transportType,
      distanceInKm: distance, // Distance approximated via road for train CO₂ estimation — actual rail distance may vary slightly. (have same info for all other types as well)
      co2emissionInKg: 0, // set to 0, so if transport type is BICYCLE or WALK, no need to add anything
      numOfPassangers: numOfPassangers,
    };
  }

  async findUserTrips(userId: string): Promise<Trip[]> {
    return await this.tripsRepo.findByUserId(userId);
  }
}

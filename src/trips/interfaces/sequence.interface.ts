import { TransportType } from 'src/trips/enums/transport-type.enum';
import { Location } from './location.interface';

export interface Sequence {
  from: Location;
  to: Location;
  date?: Date;
  transportType: TransportType;
  distanceInKm: number;
  co2emissionInKg: number;
  numOfPassangers?: number; // only used for car travel
}

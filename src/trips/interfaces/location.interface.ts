import { LocationType } from '../enums/location-type.enum';

export interface Location {
  name: string; // can't find always airports only by IATA, therefore city and airport have only 'name
  country: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
  iata?: string; // only airports have them
  type?: LocationType;
  showName: string;
}

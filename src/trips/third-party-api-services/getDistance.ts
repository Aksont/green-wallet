// Google Maps API
import axios from 'axios';
import { InternalServerErrorException } from '@nestjs/common';
import qs from 'qs';
import { Location } from 'src/trips/interfaces/location.interface';

interface DistanceMatrixResponse {
  destination_addresses: string[];
  origin_addresses: string[];
  rows: {
    elements: {
      status: string;
      distance: {
        text: string;
        value: number;
      };
      duration: {
        text: string;
        value: number;
      };
    }[];
  }[];
}

export async function getDistanceKm(
  origin: string,
  destination: string,
): Promise<number> {
  try {
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

    const params = {
      origins: origin, // can't find always airports only by IATA, therefore city and airport have only 'name'
      destinations: destination,
      mode: 'driving',
      key: GOOGLE_API_KEY,
    };

    const response = await axios.get<DistanceMatrixResponse>(
      'https://maps.googleapis.com/maps/api/distancematrix/json',
      { params },
    );

    const element = response.data.rows?.[0]?.elements?.[0];
    if (!element || element.status !== 'OK') {
      throw new InternalServerErrorException(
        `Google Maps API error: ${element?.status}`,
      );
    }

    return element.distance.value / 1000; // distance is retrieved in m, therefore divided by 1000 to get km
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('Unknown error', error);
    }
    throw new InternalServerErrorException(
      'Failed to fetch distance from Google Maps',
    );
  }
}

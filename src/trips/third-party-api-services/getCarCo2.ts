// Carbon Interface API
// https://docs.carboninterface.com/#/?id=vehicle
import axios from 'axios';
import { InternalServerErrorException } from '@nestjs/common';
import qs from 'qs';

interface CarEstimateResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      vehicle_make: string;
      vehicle_model: string;
      vehicle_year: number;
      vehicle_model_id: string;
      estimated_at: string;
      carbon_g: number;
      carbon_lb: number;
      carbon_kg: number;
      carbon_mt: number;
      distance_unit: string;
      distance_value: number;
    };
  };
}

export async function getCarCo2(distanceInKm: number): Promise<number> {
  try {
    const CARBONINTERFACE_API_KEY = process.env.CARBONINTERFACE_API_KEY;

    const body = {
      type: 'vehicle',
      distance_unit: 'km',
      distance_value: distanceInKm,
      vehicle_model_id: process.env.CI_DEFAULT_CAR_ID,
    };

    const response = await axios.post<CarEstimateResponse>(
      'https://www.carboninterface.com/api/v1/estimates',
      body,
      {
        headers: {
          Authorization: `Bearer ${CARBONINTERFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const carbon_kg = response.data.data.attributes?.carbon_kg;
    if (!carbon_kg) {
      throw new InternalServerErrorException(
        `Carbon Interface API error: ${response.status}`,
      );
    }

    return carbon_kg; // distance is retrieved in m, therefore divided by 1000 to get km
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

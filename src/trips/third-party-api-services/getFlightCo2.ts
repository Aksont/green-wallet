// Carbon Interface API
// https://docs.carboninterface.com/#/?id=flight
import axios from 'axios';
import { InternalServerErrorException } from '@nestjs/common';

interface FlightEstimateResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      passengers: number;
      legs: {
        departure_airport: string;
        destination_airport: string;
      }[];
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

export async function getFlightCo2(
  depIata: string,
  desIata: string,
): Promise<{ distanceInKm: number; co2emissionInKg: number }> {
  try {
    const CARBONINTERFACE_API_KEY = process.env.CARBONINTERFACE_API_KEY;

    const body = {
      type: 'flight',
      passengers: 1,
      legs: [
        {
          departure_airport: depIata,
          destination_airport: desIata,
        },
      ],
    };

    const response = await axios.post<FlightEstimateResponse>(
      'https://www.carboninterface.com/api/v1/estimates',
      body,
      {
        headers: {
          Authorization: `Bearer ${CARBONINTERFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const distance_value = response.data.data.attributes?.distance_value;
    const carbon_kg = response.data.data.attributes?.carbon_kg;
    if (!distance_value || !carbon_kg) {
      throw new InternalServerErrorException(
        `Carbon Interface API error: ${response.status}`,
      );
    }

    return { distanceInKm: distance_value, co2emissionInKg: carbon_kg }; // distance is retrieved in m, therefore divided by 1000 to get km
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

// Car API Service
// Currently uses local data, ready for API migration

import { apiClient } from './client';
import { CARS } from '../../features/calculator/data/carData';
import type { CarData } from '../../features/calculator/data/carData';

// Flag to toggle between local data and API
const USE_API = false;

export const carService = {
  async getAll(): Promise<CarData[]> {
    if (USE_API) {
      return apiClient.get<CarData[]>('/cars');
    }
    // Return local data for now
    return Promise.resolve(CARS);
  },

  async getByBrand(brandId: string): Promise<CarData[]> {
    if (USE_API) {
      return apiClient.get<CarData[]>('/cars', { params: { brand: brandId } });
    }
    return Promise.resolve(CARS.filter((car: CarData) => car.brand === brandId));
  },

  async getById(id: string): Promise<CarData | undefined> {
    if (USE_API) {
      return apiClient.get<CarData>(`/cars/${id}`);
    }
    return Promise.resolve(CARS.find((car: CarData) => car.id === id));
  },
};

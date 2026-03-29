// Car API Service
// Currently uses local data, ready for API migration

import { apiClient } from './client';
import { CARS } from '../../features/calculator/data/cars';
import type { Car } from '../../features/calculator/types';

// Flag to toggle between local data and API
const USE_API = false;

export const carService = {
  async getAll(): Promise<Car[]> {
    if (USE_API) {
      return apiClient.get<Car[]>('/cars');
    }
    // Return local data for now
    return Promise.resolve(CARS);
  },

  async getByBrand(brandId: string): Promise<Car[]> {
    if (USE_API) {
      return apiClient.get<Car[]>('/cars', { params: { brand: brandId } });
    }
    return Promise.resolve(CARS.filter((car: Car) => car.brand === brandId));
  },

  async getById(id: string): Promise<Car | undefined> {
    if (USE_API) {
      return apiClient.get<Car>(`/cars/${id}`);
    }
    return Promise.resolve(CARS.find((car: Car) => car.id === id));
  },
};

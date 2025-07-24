export interface City {
  id: number;
  name: string;
  state?: string;
  country?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCityPayload {
  name: string;
  state?: string;
  country?: string;
}

export interface UpdateCityPayload {
  id: number;
  name?: string;
  state?: string;
  country?: string;
}

export interface CityResponse {
  success: boolean;
  data?: City[];
  error?: string;
}

export interface CreateCityResponse {
  success: boolean;
  data?: City;
  error?: string;
} 
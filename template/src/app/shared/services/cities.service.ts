import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelperService, ApiResponse } from './api-helper.service';

// Interface for City entity
export interface City {
  id: string;
  nameAr: string;
  nameEn: string;
  countryId: string;
  countryNameAr?: string;
  countryNameEn?: string;
}

// Interface for creating a new city
export interface CreateCityRequest {
  nameAr: string;
  nameEn: string;
  countryId: string;
}

// Interface for updating a city
export interface UpdateCityRequest {
  nameAr?: string;
  nameEn?: string;
  countryId?: string;
}

// Interface for pagination parameters
export interface CitySearchParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  CountryId?: string;
}

// Interface for paginated response
export interface PaginatedCityResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: City[];
}

// Interface for the actual API response structure
export interface CitiesApiResponse {
  httpStatusCode: number;
  succeeded: boolean;
  message: string;
  errors: any;
  modelErrors: any;
  data: PaginatedCityResponse;
}

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  private readonly endpoint = 'Cities';

  constructor(private apiHelper: ApiHelperService) {
    // Set base URL for the API
    this.apiHelper.setBaseUrl('http://localhost:5050/api');
    
    // Add authentication token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.apiHelper.setAuthToken(token);
    }
  }

  /**
   * Get paginated list of cities
   */
  getCities(params?: CitySearchParams): Observable<CitiesApiResponse> {
    return this.apiHelper.get<PaginatedCityResponse>(this.endpoint, params) as unknown as Observable<CitiesApiResponse>;
  }

  /**
   * Get a single city by ID
   */
  getCityById(id: string): Observable<ApiResponse<City>> {
    return this.apiHelper.getById<City>(this.endpoint, id);
  }

  /**
   * Create a new city
   */
  createCity(cityData: CreateCityRequest): Observable<ApiResponse<City>> {
    return this.apiHelper.create<City>(this.endpoint, cityData);
  }

  /**
   * Update a city
   */
  updateCity(id: string, cityData: UpdateCityRequest): Observable<ApiResponse<City>> {
    return this.apiHelper.update<City>(this.endpoint, id, cityData);
  }

  /**
   * Partial update of a city
   */
  updateCityPartial(id: string, cityData: Partial<UpdateCityRequest>): Observable<ApiResponse<City>> {
    return this.apiHelper.updatePartial<City>(this.endpoint, id, cityData);
  }

  /**
   * Delete a city
   */
  deleteCity(id: string): Observable<ApiResponse<void>> {
    return this.apiHelper.deleteById<void>(this.endpoint, id);
  }

  /**
   * Search cities by name (Arabic or English)
   */
  searchCities(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Observable<CitiesApiResponse> {
    const params: CitySearchParams = {
      SearchTerm: searchTerm,
      PageNumber: pageNumber,
      PageSize: pageSize
    };
    return this.getCities(params);
  }

  /**
   * Get cities by country ID
   */
  getCitiesByCountry(countryId: string, pageNumber: number = 1, pageSize: number = 10): Observable<CitiesApiResponse> {
    const params: CitySearchParams = {
      CountryId: countryId,
      PageNumber: pageNumber,
      PageSize: pageSize
    };
    return this.getCities(params);
  }

  /**
   * Get all cities without pagination (for dropdowns, etc.)
   */
  getAllCities(): Observable<ApiResponse<City[]>> {
    return this.apiHelper.getList<City>(this.endpoint);
  }

  /**
   * Get cities by country ID without pagination
   */
  getCitiesByCountryId(countryId: string): Observable<ApiResponse<City[]>> {
    return this.apiHelper.get<City[]>(`${this.endpoint}/country/${countryId}`);
  }

  /**
   * Bulk create cities
   */
  bulkCreateCities(cities: CreateCityRequest[]): Observable<ApiResponse<City[]>> {
    return this.apiHelper.post<City[]>(`${this.endpoint}/bulk`, cities);
  }

  /**
   * Export cities to Excel/CSV
   */
  exportCities(format: 'excel' | 'csv' = 'excel'): Observable<Blob> {
    return this.apiHelper.downloadFile(`${this.endpoint}/export?format=${format}`);
  }

  /**
   * Import cities from file
   */
  importCities(file: File): Observable<ApiResponse<{ imported: number; errors: string[] }>> {
    return this.apiHelper.uploadFile<{ imported: number; errors: string[] }>(`${this.endpoint}/import`, file);
  }

  /**
   * Get cities statistics
   */
  getCitiesStats(): Observable<ApiResponse<{
    total: number;
    byCountry: { [countryId: string]: number };
    lastUpdated: string;
  }>> {
    return this.apiHelper.get<{
      total: number;
      byCountry: { [countryId: string]: number };
      lastUpdated: string;
    }>(`${this.endpoint}/stats`);
  }
} 
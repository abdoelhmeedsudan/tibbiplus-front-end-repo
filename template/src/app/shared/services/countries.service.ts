import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelperService, ApiResponse } from './api-helper.service';

// Interface for Country entity
export interface Country {
  id: string;
  nameAr: string;
  nameEn: string;
  code: string;
}

// Interface for creating a new country
export interface CreateCountryRequest {
  nameAr: string;
  nameEn: string;
  code: string;
}

// Interface for updating a country
export interface UpdateCountryRequest {
  nameAr?: string;
  nameEn?: string;
  code?: string;
}

// Interface for pagination parameters
export interface CountrySearchParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
}

// Interface for paginated response
export interface PaginatedCountryResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: Country[];
}

// Interface for the actual API response structure
export interface CountriesApiResponse {
  httpStatusCode: number;
  succeeded: boolean;
  message: string;
  errors: any;
  modelErrors: any;
  data: PaginatedCountryResponse;
}

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private readonly endpoint = 'Countries';

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
   * Get paginated list of countries
   */
  getCountries(params?: CountrySearchParams): Observable<CountriesApiResponse> {
    return this.apiHelper.get<PaginatedCountryResponse>(this.endpoint, params) as unknown as Observable<CountriesApiResponse>;
  }

  /**
   * Get a single country by ID
   */
  getCountryById(id: string): Observable<ApiResponse<Country>> {
    return this.apiHelper.getById<Country>(this.endpoint, id);
  }

  /**
   * Create a new country
   */
  createCountry(countryData: CreateCountryRequest): Observable<ApiResponse<Country>> {
    return this.apiHelper.create<Country>(this.endpoint, countryData);
  }

  /**
   * Update a country
   */
  updateCountry(id: string, countryData: UpdateCountryRequest): Observable<ApiResponse<Country>> {
    return this.apiHelper.update<Country>(this.endpoint, id, countryData);
  }

  /**
   * Partial update of a country
   */
  updateCountryPartial(id: string, countryData: Partial<UpdateCountryRequest>): Observable<ApiResponse<Country>> {
    return this.apiHelper.updatePartial<Country>(this.endpoint, id, countryData);
  }

  /**
   * Delete a country
   */
  deleteCountry(id: string): Observable<ApiResponse<void>> {
    return this.apiHelper.deleteById<void>(this.endpoint, id);
  }

  /**
   * Search countries by name (Arabic or English)
   */
  searchCountries(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Observable<CountriesApiResponse> {
    const params: CountrySearchParams = {
      SearchTerm: searchTerm,
      PageNumber: pageNumber,
      PageSize: pageSize
    };
    return this.getCountries(params);
  }

  /**
   * Get all countries without pagination (for dropdowns, etc.)
   */
  getAllCountries(): Observable<ApiResponse<Country[]>> {
    return this.apiHelper.getList<Country>(this.endpoint+"/all");
  }

  /**
   * Get countries by code
   */
  getCountryByCode(code: string): Observable<ApiResponse<Country>> {
    return this.apiHelper.get<Country>(`${this.endpoint}/code/${code}`);
  }

  /**
   * Check if country code exists
   */
  checkCountryCodeExists(code: string): Observable<ApiResponse<{ exists: boolean }>> {
    return this.apiHelper.get<{ exists: boolean }>(`${this.endpoint}/check-code/${code}`);
  }

  /**
   * Bulk create countries
   */
  bulkCreateCountries(countries: CreateCountryRequest[]): Observable<ApiResponse<Country[]>> {
    return this.apiHelper.post<Country[]>(`${this.endpoint}/bulk`, countries);
  }

  /**
   * Export countries to Excel/CSV
   */
  exportCountries(format: 'excel' | 'csv' = 'excel'): Observable<Blob> {
    return this.apiHelper.downloadFile(`${this.endpoint}/export?format=${format}`);
  }

  /**
   * Import countries from file
   */
  importCountries(file: File): Observable<ApiResponse<{ imported: number; errors: string[] }>> {
    return this.apiHelper.uploadFile<{ imported: number; errors: string[] }>(`${this.endpoint}/import`, file);
  }

  /**
   * Get countries statistics
   */
  getCountriesStats(): Observable<ApiResponse<{
    total: number;
    active: number;
    inactive: number;
    lastUpdated: string;
  }>> {
    return this.apiHelper.get<{
      total: number;
      active: number;
      inactive: number;
      lastUpdated: string;
    }>(`${this.endpoint}/stats`);
  }
}

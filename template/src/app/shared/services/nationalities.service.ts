import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelperService, ApiResponse } from './api-helper.service';

// Interface for Nationality entity
export interface Nationality {
  id: string;
  nameAr: string;
  nameEn: string;
}

// Interface for creating a new nationality
export interface CreateNationalityRequest {
  nameAr: string;
  nameEn: string;
}

// Interface for updating a nationality
export interface UpdateNationalityRequest {
  nameAr?: string;
  nameEn?: string;
}

// Interface for pagination parameters
export interface NationalitySearchParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
}

// Interface for paginated response
export interface PaginatedNationalityResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: Nationality[];
}

// Interface for the actual API response structure
export interface NationalitiesApiResponse {
  httpStatusCode: number;
  succeeded: boolean;
  message: string;
  errors: any;
  modelErrors: any;
  data: PaginatedNationalityResponse;
}

@Injectable({
  providedIn: 'root'
})
export class NationalitiesService {

  private readonly endpoint = 'Nationalities';

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
   * Get paginated list of nationalities
   */
  getNationalities(params?: NationalitySearchParams): Observable<NationalitiesApiResponse> {
    return this.apiHelper.get<PaginatedNationalityResponse>(this.endpoint, params) as unknown as Observable<NationalitiesApiResponse>;
  }

  /**
   * Get a single nationality by ID
   */
  getNationalityById(id: string): Observable<ApiResponse<Nationality>> {
    return this.apiHelper.getById<Nationality>(this.endpoint, id);
  }

  /**
   * Create a new nationality
   */
  createNationality(nationalityData: CreateNationalityRequest): Observable<ApiResponse<Nationality>> {
    return this.apiHelper.create<Nationality>(this.endpoint, nationalityData);
  }

  /**
   * Update a nationality
   */
  updateNationality(id: string, nationalityData: UpdateNationalityRequest): Observable<ApiResponse<Nationality>> {
    return this.apiHelper.update<Nationality>(this.endpoint, id, nationalityData);
  }

  /**
   * Partial update of a nationality
   */
  updateNationalityPartial(id: string, nationalityData: Partial<UpdateNationalityRequest>): Observable<ApiResponse<Nationality>> {
    return this.apiHelper.updatePartial<Nationality>(this.endpoint, id, nationalityData);
  }

  /**
   * Delete a nationality
   */
  deleteNationality(id: string): Observable<ApiResponse<void>> {
    return this.apiHelper.deleteById<void>(this.endpoint, id);
  }

  /**
   * Search nationalities by name (Arabic or English)
   */
  searchNationalities(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Observable<NationalitiesApiResponse> {
    const params: NationalitySearchParams = {
      SearchTerm: searchTerm,
      PageNumber: pageNumber,
      PageSize: pageSize
    };
    return this.getNationalities(params);
  }

  /**
   * Get all nationalities without pagination (for dropdowns, etc.)
   */
  getAllNationalities(): Observable<ApiResponse<Nationality[]>> {
    return this.apiHelper.getList<Nationality>(this.endpoint);
  }

  /**
   * Bulk create nationalities
   */
  bulkCreateNationalities(nationalities: CreateNationalityRequest[]): Observable<ApiResponse<Nationality[]>> {
    return this.apiHelper.post<Nationality[]>(`${this.endpoint}/bulk`, nationalities);
  }

  /**
   * Export nationalities to Excel/CSV
   */
  exportNationalities(format: 'excel' | 'csv' = 'excel'): Observable<Blob> {
    return this.apiHelper.downloadFile(`${this.endpoint}/export?format=${format}`);
  }

  /**
   * Import nationalities from file
   */
  importNationalities(file: File): Observable<ApiResponse<{ imported: number; errors: string[] }>> {
    return this.apiHelper.uploadFile<{ imported: number; errors: string[] }>(`${this.endpoint}/import`, file);
  }

  /**
   * Get nationalities statistics
   */
  getNationalitiesStats(): Observable<ApiResponse<{
    total: number;
    lastUpdated: string;
  }>> {
    return this.apiHelper.get<{
      total: number;
      lastUpdated: string;
    }>(`${this.endpoint}/stats`);
  }
} 
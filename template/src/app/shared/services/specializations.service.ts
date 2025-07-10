import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelperService, ApiResponse } from './api-helper.service';

// Interface for Specialization entity
export interface Specialization {
  id: string;
  nameAr: string;
  nameEn: string;
  jobTitleId: string;
  jobTitleNameAr: string;
  jobTitleNameEn: string;
}

// Interface for creating a new specialization
export interface CreateSpecializationRequest {
  nameAr: string;
  nameEn: string;
  jobTitleId: string;
}

// Interface for updating a specialization
export interface UpdateSpecializationRequest {
  nameAr?: string;
  nameEn?: string;
  jobTitleId?: string;
}

// Interface for pagination parameters
export interface SpecializationSearchParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
}

// Interface for paginated response
export interface PaginatedSpecializationResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: Specialization[];
}

// Interface for the actual API response structure
export interface SpecializationsApiResponse {
  httpStatusCode: number;
  succeeded: boolean;
  message: string;
  errors: any;
  modelErrors: any;
  data: PaginatedSpecializationResponse;
}

@Injectable({
  providedIn: 'root'
})
export class SpecializationsService {

  private readonly endpoint = 'Specializations';

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
   * Get paginated list of specializations
   */
  getSpecializations(params?: SpecializationSearchParams): Observable<SpecializationsApiResponse> {
    return this.apiHelper.get<PaginatedSpecializationResponse>(this.endpoint, params) as unknown as Observable<SpecializationsApiResponse>;
  }

  /**
   * Get a single specialization by ID
   */
  getSpecializationById(id: string): Observable<ApiResponse<Specialization>> {
    return this.apiHelper.getById<Specialization>(this.endpoint, id);
  }

  /**
   * Create a new specialization
   */
  createSpecialization(specializationData: CreateSpecializationRequest): Observable<ApiResponse<Specialization>> {
    return this.apiHelper.create<Specialization>(this.endpoint, specializationData);
  }

  /**
   * Update a specialization
   */
  updateSpecialization(id: string, specializationData: UpdateSpecializationRequest): Observable<ApiResponse<Specialization>> {
    return this.apiHelper.update<Specialization>(this.endpoint, id, specializationData);
  }

  /**
   * Partial update of a specialization
   */
  updateSpecializationPartial(id: string, specializationData: Partial<UpdateSpecializationRequest>): Observable<ApiResponse<Specialization>> {
    return this.apiHelper.updatePartial<Specialization>(this.endpoint, id, specializationData);
  }

  /**
   * Delete a specialization
   */
  deleteSpecialization(id: string): Observable<ApiResponse<void>> {
    return this.apiHelper.deleteById<void>(this.endpoint, id);
  }

  /**
   * Search specializations by name (Arabic or English)
   */
  searchSpecializations(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Observable<SpecializationsApiResponse> {
    const params: SpecializationSearchParams = {
      SearchTerm: searchTerm,
      PageNumber: pageNumber,
      PageSize: pageSize
    };
    return this.getSpecializations(params);
  }

  /**
   * Get all specializations without pagination (for dropdowns, etc.)
   */
  getAllSpecializations(): Observable<ApiResponse<Specialization[]>> {
    return this.apiHelper.getList<Specialization>(this.endpoint+"/all");
  }

  /**
   * Get specializations by job title ID
   */
  getSpecializationsByJobTitle(jobTitleId: string): Observable<ApiResponse<Specialization[]>> {
    return this.apiHelper.get<Specialization[]>(`${this.endpoint}/job-title/${jobTitleId}`);
  }

  /**
   * Get specializations statistics
   */
  getSpecializationsStats(): Observable<ApiResponse<{
    total: number;
    lastUpdated: string;
  }>> {
    return this.apiHelper.get<{
      total: number;
      lastUpdated: string;
    }>(`${this.endpoint}/stats`);
  }
} 
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelperService, ApiResponse } from './api-helper.service';

// Interface for SubSpecialization entity
export interface SubSpecialization {
  id: string;
  nameAr: string;
  nameEn: string;
  specializationId: string;
  specializationNameAr: string;
  specializationNameEn: string;
}

// Interface for creating a new sub specialization
export interface CreateSubSpecializationRequest {
  nameAr: string;
  nameEn: string;
  specializationId: string;
}

// Interface for updating a sub specialization
export interface UpdateSubSpecializationRequest {
  nameAr?: string;
  nameEn?: string;
  specializationId?: string;
}

// Interface for pagination parameters
export interface SubSpecializationSearchParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
}

// Interface for paginated response
export interface PaginatedSubSpecializationResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: SubSpecialization[];
}

// Interface for the actual API response structure
export interface SubSpecializationsApiResponse {
  httpStatusCode: number;
  succeeded: boolean;
  message: string;
  errors: any;
  modelErrors: any;
  data: PaginatedSubSpecializationResponse;
}

@Injectable({
  providedIn: 'root'
})
export class SubSpecializationsService {

  private readonly endpoint = 'SubSpecializations';

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
   * Get paginated list of sub specializations
   */
  getSubSpecializations(params?: SubSpecializationSearchParams): Observable<SubSpecializationsApiResponse> {
    return this.apiHelper.get<PaginatedSubSpecializationResponse>(this.endpoint, params) as unknown as Observable<SubSpecializationsApiResponse>;
  }

  /**
   * Get a single sub specialization by ID
   */
  getSubSpecializationById(id: string): Observable<ApiResponse<SubSpecialization>> {
    return this.apiHelper.getById<SubSpecialization>(this.endpoint, id);
  }

  /**
   * Create a new sub specialization
   */
  createSubSpecialization(subSpecializationData: CreateSubSpecializationRequest): Observable<ApiResponse<SubSpecialization>> {
    return this.apiHelper.create<SubSpecialization>(this.endpoint, subSpecializationData);
  }

  /**
   * Update a sub specialization
   */
  updateSubSpecialization(id: string, subSpecializationData: UpdateSubSpecializationRequest): Observable<ApiResponse<SubSpecialization>> {
    return this.apiHelper.update<SubSpecialization>(this.endpoint, id, subSpecializationData);
  }

  /**
   * Partial update of a sub specialization
   */
  updateSubSpecializationPartial(id: string, subSpecializationData: Partial<UpdateSubSpecializationRequest>): Observable<ApiResponse<SubSpecialization>> {
    return this.apiHelper.updatePartial<SubSpecialization>(this.endpoint, id, subSpecializationData);
  }

  /**
   * Delete a sub specialization
   */
  deleteSubSpecialization(id: string): Observable<ApiResponse<void>> {
    return this.apiHelper.deleteById<void>(this.endpoint, id);
  }

  /**
   * Search sub specializations by name (Arabic or English)
   */
  searchSubSpecializations(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Observable<SubSpecializationsApiResponse> {
    const params: SubSpecializationSearchParams = {
      SearchTerm: searchTerm,
      PageNumber: pageNumber,
      PageSize: pageSize
    };
    return this.getSubSpecializations(params);
  }

  /**
   * Get all sub specializations without pagination (for dropdowns, etc.)
   */
  getAllSubSpecializations(): Observable<ApiResponse<SubSpecialization[]>> {
    return this.apiHelper.getList<SubSpecialization>(this.endpoint+"/all");
  }

  /**
   * Get sub specializations by specialization ID
   */
  getSubSpecializationsBySpecialization(specializationId: string): Observable<ApiResponse<SubSpecialization[]>> {
    return this.apiHelper.get<SubSpecialization[]>(`${this.endpoint}/specialization/${specializationId}`);
  }

  /**
   * Get sub specializations statistics
   */
  getSubSpecializationsStats(): Observable<ApiResponse<{
    total: number;
    lastUpdated: string;
  }>> {
    return this.apiHelper.get<{
      total: number;
      lastUpdated: string;
    }>(`${this.endpoint}/stats`);
  }
} 
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelperService, ApiResponse } from './api-helper.service';

// Interface for MedicalCouncil entity
export interface MedicalCouncil {
  id: string;
  nameAr: string;
  nameEn: string;
}

// Interface for creating a new medical council
export interface CreateMedicalCouncilRequest {
  nameAr: string;
  nameEn: string;
}

// Interface for updating a medical council
export interface UpdateMedicalCouncilRequest {
  nameAr?: string;
  nameEn?: string;
}

// Interface for pagination parameters
export interface MedicalCouncilSearchParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
}

// Interface for paginated response
export interface PaginatedMedicalCouncilResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: MedicalCouncil[];
}

// Interface for the actual API response structure
export interface MedicalCouncilsApiResponse {
  httpStatusCode: number;
  succeeded: boolean;
  message: string;
  errors: any;
  modelErrors: any;
  data: PaginatedMedicalCouncilResponse;
}

@Injectable({
  providedIn: 'root'
})
export class MedicalCouncilService {

  private readonly endpoint = 'MedicalCouncil';

  constructor(private apiHelper: ApiHelperService) {
    // Set base URL for the API
    this.apiHelper.setBaseUrl('http://localhost:5270/api');
    
    // Add authentication token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.apiHelper.setAuthToken(token);
    }
  }

  /**
   * Get paginated list of medical councils
   */
  getMedicalCouncils(params?: MedicalCouncilSearchParams): Observable<MedicalCouncilsApiResponse> {
    return this.apiHelper.get<PaginatedMedicalCouncilResponse>(this.endpoint, params) as unknown as Observable<MedicalCouncilsApiResponse>;
  }

  /**
   * Get a single medical council by ID
   */
  getMedicalCouncilById(id: string): Observable<ApiResponse<MedicalCouncil>> {
    return this.apiHelper.getById<MedicalCouncil>(this.endpoint, id);
  }

  /**
   * Create a new medical council
   */
  createMedicalCouncil(medicalCouncilData: CreateMedicalCouncilRequest): Observable<ApiResponse<MedicalCouncil>> {
    return this.apiHelper.create<MedicalCouncil>(this.endpoint, medicalCouncilData);
  }

  /**
   * Update a medical council
   */
  updateMedicalCouncil(id: string, medicalCouncilData: UpdateMedicalCouncilRequest): Observable<ApiResponse<MedicalCouncil>> {
    return this.apiHelper.update<MedicalCouncil>(this.endpoint, id, medicalCouncilData);
  }

  /**
   * Partial update of a medical council
   */
  updateMedicalCouncilPartial(id: string, medicalCouncilData: Partial<UpdateMedicalCouncilRequest>): Observable<ApiResponse<MedicalCouncil>> {
    return this.apiHelper.updatePartial<MedicalCouncil>(this.endpoint, id, medicalCouncilData);
  }

  /**
   * Delete a medical council
   */
  deleteMedicalCouncil(id: string): Observable<ApiResponse<void>> {
    return this.apiHelper.deleteById<void>(this.endpoint, id);
  }

  /**
   * Search medical councils by name (Arabic or English)
   */
  searchMedicalCouncils(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Observable<MedicalCouncilsApiResponse> {
    const params: MedicalCouncilSearchParams = {
      SearchTerm: searchTerm,
      PageNumber: pageNumber,
      PageSize: pageSize
    };
    return this.getMedicalCouncils(params);
  }

  /**
   * Get all medical councils without pagination (for dropdowns, etc.)
   */
  getAllMedicalCouncils(): Observable<ApiResponse<MedicalCouncil[]>> {
    return this.apiHelper.getList<MedicalCouncil>(this.endpoint+"/all");
  }
} 
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelperService, ApiResponse } from './api-helper.service';

// Interface for JobTitle entity
export interface JobTitle {
  id: string;
  nameAr: string;
  nameEn: string;
}

// Interface for creating a new job title
export interface CreateJobTitleRequest {
  nameAr: string;
  nameEn: string;
}

// Interface for updating a job title
export interface UpdateJobTitleRequest {
  nameAr?: string;
  nameEn?: string;
}

// Interface for pagination parameters
export interface JobTitleSearchParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
}

// Interface for paginated response
export interface PaginatedJobTitleResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: JobTitle[];
}

// Interface for the actual API response structure
export interface JobTitlesApiResponse {
  httpStatusCode: number;
  succeeded: boolean;
  message: string;
  errors: any;
  modelErrors: any;
  data: PaginatedJobTitleResponse;
}

@Injectable({
  providedIn: 'root'
})
export class JobTitlesService {

  private readonly endpoint = 'JobTitles';

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
   * Get paginated list of job titles
   */
  getJobTitles(params?: JobTitleSearchParams): Observable<JobTitlesApiResponse> {
    return this.apiHelper.get<PaginatedJobTitleResponse>(this.endpoint, params) as unknown as Observable<JobTitlesApiResponse>;
  }

  /**
   * Get all job titles without pagination (for dropdowns, etc.)
   */
  getAllJobTitles(): Observable<ApiResponse<JobTitle[]>> {
    return this.apiHelper.getList<JobTitle>(this.endpoint+"/all");
  }

  /**
   * Get a single job title by ID
   */
  getJobTitleById(id: string): Observable<ApiResponse<JobTitle>> {
    return this.apiHelper.getById<JobTitle>(this.endpoint, id);
  }

  /**
   * Create a new job title
   */
  createJobTitle(jobTitleData: CreateJobTitleRequest): Observable<ApiResponse<JobTitle>> {
    return this.apiHelper.create<JobTitle>(this.endpoint, jobTitleData);
  }

  /**
   * Update a job title
   */
  updateJobTitle(id: string, jobTitleData: UpdateJobTitleRequest): Observable<ApiResponse<JobTitle>> {
    return this.apiHelper.update<JobTitle>(this.endpoint, id, jobTitleData);
  }

  /**
   * Partial update of a job title
   */
  updateJobTitlePartial(id: string, jobTitleData: Partial<UpdateJobTitleRequest>): Observable<ApiResponse<JobTitle>> {
    return this.apiHelper.updatePartial<JobTitle>(this.endpoint, id, jobTitleData);
  }

  /**
   * Delete a job title
   */
  deleteJobTitle(id: string): Observable<ApiResponse<void>> {
    return this.apiHelper.deleteById<void>(this.endpoint, id);
  }

  /**
   * Search job titles by name (Arabic or English)
   */
  searchJobTitles(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Observable<JobTitlesApiResponse> {
    const params: JobTitleSearchParams = {
      SearchTerm: searchTerm,
      PageNumber: pageNumber,
      PageSize: pageSize
    };
    return this.getJobTitles(params);
  }

  /**
   * Get job titles statistics
   */
  getJobTitlesStats(): Observable<ApiResponse<{
    total: number;
    lastUpdated: string;
  }>> {
    return this.apiHelper.get<{
      total: number;
      lastUpdated: string;
    }>(`${this.endpoint}/stats`);
  }
} 
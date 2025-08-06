import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelperService, ApiResponse } from './api-helper.service';

// Interface for Rank entity
export interface Rank {
  id: string;
  nameAr: string;
  nameEn: string;
  jobTitleId: string;
  jobTitleNameAr: string;
  jobTitleNameEn: string;
}

// Interface for creating a new rank
export interface CreateRankRequest {
  nameAr: string;
  nameEn: string;
  jobTitleId: string;
}

// Interface for updating a rank
export interface UpdateRankRequest {
  nameAr?: string;
  nameEn?: string;
  jobTitleId?: string;
}

// Interface for pagination parameters
export interface RankSearchParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
}

// Interface for paginated response
export interface PaginatedRankResponse {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
  items: Rank[];
}

// Interface for the actual API response structure
export interface RanksApiResponse {
  httpStatusCode: number;
  succeeded: boolean;
  message: string;
  errors: any;
  modelErrors: any;
  data: PaginatedRankResponse;
}

@Injectable({
  providedIn: 'root'
})
export class RanksService {

  private readonly endpoint = 'Ranks';

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
   * Get paginated list of ranks
   */
  getRanks(params?: RankSearchParams): Observable<RanksApiResponse> {
    return this.apiHelper.get<PaginatedRankResponse>(this.endpoint, params) as unknown as Observable<RanksApiResponse>;
  }

  /**
   * Get a single rank by ID
   */
  getRankById(id: string): Observable<ApiResponse<Rank>> {
    return this.apiHelper.getById<Rank>(this.endpoint, id);
  }

  /**
   * Create a new rank
   */
  createRank(rankData: CreateRankRequest): Observable<ApiResponse<Rank>> {
    return this.apiHelper.create<Rank>(this.endpoint, rankData);
  }

  /**
   * Update a rank
   */
  updateRank(id: string, rankData: UpdateRankRequest): Observable<ApiResponse<Rank>> {
    return this.apiHelper.update<Rank>(this.endpoint, id, rankData);
  }

  /**
   * Partial update of a rank
   */
  updateRankPartial(id: string, rankData: Partial<UpdateRankRequest>): Observable<ApiResponse<Rank>> {
    return this.apiHelper.updatePartial<Rank>(this.endpoint, id, rankData);
  }

  /**
   * Delete a rank
   */
  deleteRank(id: string): Observable<ApiResponse<void>> {
    return this.apiHelper.deleteById<void>(this.endpoint, id);
  }

  /**
   * Search ranks by name (Arabic or English)
   */
  searchRanks(searchTerm: string, pageNumber: number = 1, pageSize: number = 10): Observable<RanksApiResponse> {
    const params: RankSearchParams = {
      SearchTerm: searchTerm,
      PageNumber: pageNumber,
      PageSize: pageSize
    };
    return this.getRanks(params);
  }

  /**
   * Get all ranks without pagination (for dropdowns, etc.)
   */
  getAllRanks(): Observable<ApiResponse<Rank[]>> {
    return this.apiHelper.getList<Rank>(this.endpoint+"/all");
  }

  /**
   * Get ranks by job title ID
   */
  getRanksByJobTitle(jobTitleId: string): Observable<ApiResponse<Rank[]>> {
    return this.apiHelper.get<Rank[]>(`${this.endpoint}/job-title/${jobTitleId}`);
  }

  /**
   * Get ranks statistics
   */
  getRanksStats(): Observable<ApiResponse<{
    total: number;
    lastUpdated: string;
  }>> {
    return this.apiHelper.get<{
      total: number;
      lastUpdated: string;
    }>(`${this.endpoint}/stats`);
  }
} 
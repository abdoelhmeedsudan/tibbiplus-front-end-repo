import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface PersonalInfo {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  maritalStatus: string;
  address: string;
  city: string;
  country: string;
}

export interface CreatePersonalInfoRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  genderId: string;
  nationalityId: string;
  maritalStatusId: string;
  address: string;
  cityId: string;
  countryId: string;
}

export interface UpdatePersonalInfoRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  genderId: string;
  nationalityId: string;
  maritalStatusId: string;
  address: string;
  cityId: string;
  countryId: string;
}

export interface PagedResponse<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PersonalInfoService {
  constructor(private apiService: ApiService) {}

  // Get all personal info with pagination
  getAll(page: number = 1, pageSize: number = 10): Observable<PagedResponse<PersonalInfo>> {
    return this.apiService.getInternal<PagedResponse<PersonalInfo>>(`PersonalInfo?page=${page}&pageSize=${pageSize}`);
  }

  // Get personal info by ID
  getById(id: string): Observable<PersonalInfo> {
    return this.apiService.getInternal<PersonalInfo>(`PersonalInfo/${id}`);
  }

  // Create new personal info
  create(data: CreatePersonalInfoRequest): Observable<string> {
    return this.apiService.postInternal<string>('PersonalInfo', data);
  }

  // Update personal info
  update(id: string, data: UpdatePersonalInfoRequest): Observable<boolean> {
    return this.apiService.putInternal<boolean>(`PersonalInfo/${id}`, data);
  }

  // Delete personal info
  delete(id: string): Observable<boolean> {
    return this.apiService.deleteInternal<boolean>(`PersonalInfo/${id}`);
  }
} 
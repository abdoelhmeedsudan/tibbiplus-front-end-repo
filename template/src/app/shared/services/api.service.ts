import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly INTERNAL_API_URL = 'http://localhost:5180/api';
  private readonly EXTERNAL_API_URL = 'http://localhost:5142/api';

  constructor(private http: HttpClient) {}

  // Internal API methods
  getInternal<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.INTERNAL_API_URL}/${endpoint}`);
  }

  postInternal<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.INTERNAL_API_URL}/${endpoint}`, data);
  }

  putInternal<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.INTERNAL_API_URL}/${endpoint}`, data);
  }

  deleteInternal<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.INTERNAL_API_URL}/${endpoint}`);
  }

  // External API methods
  getExternal<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.EXTERNAL_API_URL}/${endpoint}`);
  }

  postExternal<T>(endpoint: string, data: any): Observable<T> {
    return this.http.post<T>(`${this.EXTERNAL_API_URL}/${endpoint}`, data);
  }

  putExternal<T>(endpoint: string, data: any): Observable<T> {
    return this.http.put<T>(`${this.EXTERNAL_API_URL}/${endpoint}`, data);
  }

  deleteExternal<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.EXTERNAL_API_URL}/${endpoint}`);
  }
} 
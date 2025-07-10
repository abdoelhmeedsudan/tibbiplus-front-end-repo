import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface ApiResponse<T> {
  data: T;
  message: string;
  succeeded: boolean;
  status: number;
}

export interface ApiError {
  message: string;
  status: number;
  error?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiHelperService {

  private baseUrl: string = 'http://localhost:5050/api/'; // يمكن تغييرها حسب الحاجة
  private defaultHeaders: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  constructor(private http: HttpClient) { }

  /**
   * تعيين URL الأساسي للـ API
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * إضافة headers مخصصة
   */
  setHeaders(headers: { [key: string]: string }): void {
    this.defaultHeaders = new HttpHeaders(headers);
  }

  /**
   * إضافة token للمصادقة
   */
  setAuthToken(token: string): void {
    this.defaultHeaders = this.defaultHeaders.set('Authorization', `Bearer ${token}`);
  }

  /**
   * GET Request
   */
  get<T>(endpoint: string, params?: any, customHeaders?: HttpHeaders): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    const httpParams = this.buildHttpParams(params);
    const headers = customHeaders || this.defaultHeaders;
  
    const res = this.http.get<ApiResponse<T>>(url, { headers, params: httpParams })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  
    res.subscribe({
      next: (response) => console.log('API Response:', response),
      error: (err) => console.error('API Error:', err)
    });
  
    return res;
  }
  

  /**
   * POST Request
   */
  post<T>(endpoint: string, data: any, customHeaders?: HttpHeaders): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    const headers = customHeaders || this.defaultHeaders;

    return this.http.post<ApiResponse<T>>(url, data, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * PUT Request
   */
  put<T>(endpoint: string, data: any, customHeaders?: HttpHeaders): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    const headers = customHeaders || this.defaultHeaders;

    return this.http.put<ApiResponse<T>>(url, data, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * PATCH Request
   */
  patch<T>(endpoint: string, data: any, customHeaders?: HttpHeaders): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    const headers = customHeaders || this.defaultHeaders;

    return this.http.patch<ApiResponse<T>>(url, data, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * DELETE Request
   */
  delete<T>(endpoint: string, customHeaders?: HttpHeaders): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    const headers = customHeaders || this.defaultHeaders;

    return this.http.delete<ApiResponse<T>>(url, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * GET Request للحصول على قائمة
   */
  getList<T>(endpoint: string, params?: any): Observable<ApiResponse<T[]>> {
    return this.get<T[]>(endpoint, params);
  }

  /**
   * GET Request للحصول على عنصر واحد
   */
  getById<T>(endpoint: string, id: string | number): Observable<ApiResponse<T>> {
    return this.get<T>(`${endpoint}/${id}`);
  }

  /**
   * POST Request لإنشاء عنصر جديد
   */
  create<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    return this.post<T>(endpoint, data);
  }

  /**
   * PUT Request لتحديث عنصر
   */
  update<T>(endpoint: string, id: string | number, data: any): Observable<ApiResponse<T>> {
    return this.put<T>(`${endpoint}/${id}`, data);
  }

  /**
   * PATCH Request لتحديث جزئي لعنصر
   */
  updatePartial<T>(endpoint: string, id: string | number, data: any): Observable<ApiResponse<T>> {
    return this.patch<T>(`${endpoint}/${id}`, data);
  }

  /**
   * DELETE Request لحذف عنصر
   */
  deleteById<T>(endpoint: string, id: string | number): Observable<ApiResponse<T>> {
    return this.delete<T>(`${endpoint}/${id}`);
  }

  /**
   * بناء HttpParams من object
   */
  private buildHttpParams(params: any): HttpParams {
    if (!params) {
      return new HttpParams();
    }

    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return httpParams;
  }

  /**
   * معالجة الأخطاء
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'حدث خطأ غير متوقع';

    if (error.error instanceof ErrorEvent) {
      // خطأ في جانب العميل
      errorMessage = `خطأ في العميل: ${error.error.message}`;
    } else {
      // خطأ في جانب الخادم
      switch (error.status) {
        case 400:
          errorMessage = 'طلب غير صحيح';
          break;
        case 401:
          errorMessage = 'غير مصرح لك بالوصول';
          break;
        case 403:
          errorMessage = 'ممنوع الوصول';
          break;
        case 404:
          errorMessage = 'المورد غير موجود';
          break;
        case 409:
          errorMessage = 'تعارض في البيانات';
          break;
        case 422:
          errorMessage = 'بيانات غير صحيحة';
          break;
        case 500:
          errorMessage = 'خطأ في الخادم';
          break;
        default:
          errorMessage = `خطأ في الخادم: ${error.status}`;
      }
    }

    const apiError: ApiError = {
      message: errorMessage,
      status: error.status,
      error: error.error
    };

    console.error('API Error:', apiError);
    return throwError(() => apiError);
  }

  /**
   * تحميل ملف
   */
  uploadFile<T>(endpoint: string, file: File, customHeaders?: HttpHeaders): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    const formData = new FormData();
    formData.append('file', file);

    const headers = customHeaders || new HttpHeaders();
    // لا نضع Content-Type للـ FormData، سيتم تعيينه تلقائياً

    return this.http.post<ApiResponse<T>>(url, formData, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * تحميل ملفات متعددة
   */
  uploadMultipleFiles<T>(endpoint: string, files: File[], customHeaders?: HttpHeaders): Observable<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint}`;
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });

    const headers = customHeaders || new HttpHeaders();

    return this.http.post<ApiResponse<T>>(url, formData, { headers })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  /**
   * تحميل ملف كـ blob
   */
  downloadFile(endpoint: string, filename?: string): Observable<Blob> {
    const url = `${this.baseUrl}/${endpoint}`;
    const headers = this.defaultHeaders.set('Accept', 'application/octet-stream');

    return this.http.get(url, { headers, responseType: 'blob' })
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
} 
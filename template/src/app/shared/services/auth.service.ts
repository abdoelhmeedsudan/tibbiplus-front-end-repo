import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  fullName: string;
}

export interface LoginRequest {
  userName: string;
  password: string;
}

export interface LoginResponse {
  httpStatusCode: number;
  succeeded: boolean;
  message: string;
  errors: any;
  modelErrors: any;
  data: {
    token: string;
    expiresDate: string;
    userName: string;
    roles: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = 'http://localhost:5270/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  // تسجيل الدخول المباشر
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/Auth/Login`, credentials).pipe(
      tap((response) => {
        if (response.succeeded && response.data) {
          this.setToken(response.data.token);
          
          // إنشاء كائن المستخدم من البيانات المستلمة
          const user: User = {
            id: response.data.userName, // استخدام userName كـ ID مؤقت
            username: response.data.userName,
            email: '', // لا يوجد email في الاستجابة
            firstName: response.data.userName,
            lastName: '',
            roles: response.data.roles,
            fullName: response.data.userName
          };
          
          this.setCurrentUser(user);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        
        // معالجة استجابة Bad Request
        if (error.status === 400 && error.error) {
          const errorResponse = error.error as LoginResponse;
          return throwError(() => new Error(errorResponse.message || 'Invalid credentials'));
        }
        
        // معالجة أخطاء أخرى
        return throwError(() => new Error('حدث خطأ في الاتصال بالخادم'));
      })
    );
  }

  // تسجيل الخروج
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  // تجديد الـ token
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post(`${this.API_BASE_URL}/auth/refresh`, { refreshToken }).pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          this.setToken(response.data.token);
          this.setRefreshToken(response.data.refreshToken);
        }
      }),
      catchError(error => {
        this.clearAuthData();
        this.router.navigate(['/auth/login']);
        return throwError(() => error);
      })
    );
  }

  // التحقق من صحة الـ token
  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // جلب معلومات المستخدم الحالي
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // التحقق من وجود صلاحية معينة
  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.roles.includes(role) : false;
  }

  // جلب الـ token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // حفظ الـ token
  private setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  // جلب refresh token
  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  // حفظ refresh token
  private setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  }

  // حفظ بيانات المستخدم
  private setCurrentUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // تحميل بيانات المستخدم من localStorage
  private loadCurrentUser(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearAuthData();
      }
    }
  }

  // مسح بيانات المصادقة
  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // التحقق من وجود خطأ
  hasError(): boolean {
    return false; // يمكن تعديل هذا حسب الحاجة
  }

  // جلب رسالة الخطأ
  getErrorMessage(): string {
    return ''; // يمكن تعديل هذا حسب الحاجة
  }
} 
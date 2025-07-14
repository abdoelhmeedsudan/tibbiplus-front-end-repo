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

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly IDENTITY_SERVER_URL = 'https://localhost:5001';
  private readonly CLIENT_ID = 'tibbiplus.cv.angular';
  private readonly REDIRECT_URI = 'http://localhost:4200/signin-callback';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  // بدء عملية تسجيل الدخول - إرسال المستخدمة إلى IdentityServer
  async login(): Promise<void> {
    const state = this.generateRandomString();
    const codeVerifier = this.generateRandomString();
    
    // حفظ state و codeVerifier للتحقق لاحقاً
    localStorage.setItem('auth_state', state);
    localStorage.setItem('code_verifier', codeVerifier);
    
    // إنشاء code challenge
    const codeChallenge = await this.generateCodeChallenge(codeVerifier);
    
    // بناء URL تسجيل الدخول
    const loginUrl = `${this.IDENTITY_SERVER_URL}/connect/authorize?` +
      `client_id=${this.CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(this.REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('openid profile id role fullName userType tibbiplus.cv.external tibbiplus.cv.internal')}&` +
      `state=${state}&` +
      `code_challenge=${codeChallenge}&` +
      `code_challenge_method=S256`;
    
    // إرسال المستخدمة إلى IdentityServer
    window.location.href = loginUrl;
  }

  // معالجة callback من IdentityServer
  handleSigninCallback(): Observable<boolean> {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');
    
    // التحقق من وجود خطأ
    if (error) {
      console.error('Authentication error:', error);
      return throwError(() => new Error(error));
    }
    
    // التحقق من وجود code
    if (!code) {
      return throwError(() => new Error('No authorization code received'));
    }
    
    // التحقق من state
    const savedState = localStorage.getItem('auth_state');
    if (state !== savedState) {
      return throwError(() => new Error('Invalid state parameter'));
    }
    
    // استبدال code بـ token
    return this.exchangeCodeForToken(code);
  }

  // استبدال authorization code بـ access token
  private exchangeCodeForToken(code: string): Observable<boolean> {
    const codeVerifier = localStorage.getItem('code_verifier');
    
    const body = new URLSearchParams();
    body.set('client_id', this.CLIENT_ID);
    body.set('grant_type', 'authorization_code');
    body.set('code', code);
    body.set('redirect_uri', this.REDIRECT_URI);
    body.set('code_verifier', codeVerifier || '');
    
    return this.http.post(`${this.IDENTITY_SERVER_URL}/connect/token`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap((response: any) => {
        // حفظ الـ tokens
        this.setToken(response.access_token);
        this.setRefreshToken(response.refresh_token);
        
        // جلب معلومات المستخدم
        this.loadUserInfo(response.access_token);
        
        // مسح البيانات المؤقتة
        localStorage.removeItem('auth_state');
        localStorage.removeItem('code_verifier');
      }),
      map(() => true),
      catchError(error => {
        console.error('Token exchange error:', error);
        return throwError(() => error);
      })
    );
  }

  // جلب معلومات المستخدم من IdentityServer
  private loadUserInfo(token: string): void {
    this.http.get(`${this.IDENTITY_SERVER_URL}/connect/userinfo`, {
      headers: { 'Authorization': `Bearer ${token}` }
    }).subscribe({
      next: (userInfo: any) => {
        const user: User = {
          id: userInfo.sub,
          username: userInfo.preferred_username || userInfo.name,
          email: userInfo.email,
          firstName: userInfo.given_name || '',
          lastName: userInfo.family_name || '',
          roles: userInfo.role ? [userInfo.role] : [],
          fullName: userInfo.name || `${userInfo.given_name} ${userInfo.family_name}`
        };
        
        this.setCurrentUser(user);
      },
      error: (error) => {
        console.error('Error loading user info:', error);
      }
    });
  }

  // تسجيل الخروج
  logout(): void {
    const token = this.getToken();
    if (token) {
      // إرسال طلب تسجيل الخروج للخادم
      const logoutUrl = `${this.IDENTITY_SERVER_URL}/connect/endsession?` +
        `client_id=${this.CLIENT_ID}&` +
        `post_logout_redirect_uri=${encodeURIComponent('http://localhost:4200/signout-callback')}` +
        `id_token_hint=${token}`;
      
      window.location.href = logoutUrl;
    } else {
      this.clearAuthData();
      this.router.navigate(['/auth/login']);
    }
  }

  // معالجة callback تسجيل الخروج
  handleSignoutCallback(): void {
    this.clearAuthData();
    this.router.navigate(['/auth/login']);
  }

  // تجديد الـ token
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const body = new URLSearchParams();
    body.set('client_id', this.CLIENT_ID);
    body.set('grant_type', 'refresh_token');
    body.set('refresh_token', refreshToken);

    return this.http.post(`${this.IDENTITY_SERVER_URL}/connect/token`, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).pipe(
      tap((response: any) => {
        this.setToken(response.access_token);
        this.setRefreshToken(response.refresh_token);
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
      } catch {
        this.clearAuthData();
      }
    }
  }

  // مسح جميع بيانات المصادقة
  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  // توليد string عشوائي
  private generateRandomString(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // توليد code challenge
  private async generateCodeChallenge(codeVerifier: string): Promise<string> {
    // استخدام SHA256 hash كما هو مطلوب في PKCE
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashBase64 = btoa(String.fromCharCode(...hashArray));
    return hashBase64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  // التحقق من وجود خطأ في URL
  hasError(): boolean {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('error');
  }

  // جلب رسالة الخطأ
  getErrorMessage(): string {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('error_description') || urlParams.get('error') || 'خطأ غير معروف';
  }
} 
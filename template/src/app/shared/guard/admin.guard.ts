import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    // التحقق من وجود token صالح
    if (!this.authService.isTokenValid()) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // التحقق من وجود مستخدم
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    return true;
  }
}

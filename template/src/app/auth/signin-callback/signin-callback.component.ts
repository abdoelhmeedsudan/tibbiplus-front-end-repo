import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid p-0">
      <div class="row m-0">
        <div class="col-12 p-0">    
          <div class="login-card login-dark">
            <div class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">جاري التحميل...</span>
              </div>
              <h4 class="mt-3">جاري إكمال تسجيل الدخول...</h4>
              <p class="text-muted">يرجى الانتظار</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-card {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class SigninCallbackComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    // التحقق من وجود خطأ في URL
    if (this.authService.hasError()) {
      const errorMessage = this.authService.getErrorMessage();
      this.toast.error('فشل في تسجيل الدخول: ' + errorMessage, 'خطأ');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.handleCallback();
  }

  private handleCallback(): void {
    this.authService.handleSigninCallback().subscribe({
      next: () => {
        this.toast.success('تم تسجيل الدخول بنجاح!', 'مرحباً');
        this.router.navigate(['/dashboard/default']);
      },
      error: (error) => {
        console.error('Signin callback error:', error);
        this.toast.error('فشل في تسجيل الدخول: ' + error.message, 'خطأ');
        this.router.navigate(['/auth/login']);
      }
    });
  }
} 
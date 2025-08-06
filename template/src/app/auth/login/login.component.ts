
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService, LoginRequest } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    public router: Router, 
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    // التحقق من وجود مستخدم مسجل مسبقاً
    if (this.authService.isTokenValid()) {
      router.navigate(['/dashboard/default']);
    }
    
    this.initForm();
  }

  private initForm(): void {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // تسجيل الدخول
  async login(): Promise<void> {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const credentials: LoginRequest = {
      userName: this.loginForm.get('userName')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response.succeeded) {
          this.router.navigate(['/dashboard/default']);
        } else {
          this.errorMessage = response.message || 'فشل في تسجيل الدخول';
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        // عرض رسالة الخطأ من الخادم أو رسالة افتراضية
        this.errorMessage = error.message || 'حدث خطأ أثناء تسجيل الدخول';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

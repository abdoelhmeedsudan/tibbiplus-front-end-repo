import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-signout-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid p-0">
      <div class="row m-0">
        <div class="col-12 p-0">    
          <div class="login-card login-dark">
            <div class="text-center">
              <div class="spinner-border text-success" role="status">
                <span class="visually-hidden">جاري التحميل...</span>
              </div>
              <h4 class="mt-3">تم تسجيل الخروج بنجاح</h4>
              <p class="text-muted">جاري إعادة التوجيه...</p>
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
export class SignoutCallbackComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // معالجة callback تسجيل الخروج
    this.authService.handleSignoutCallback();
  }
} 
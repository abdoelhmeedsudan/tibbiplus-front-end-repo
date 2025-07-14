
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  constructor(
    public router: Router, 
    private authService: AuthService
  ) {
    // التحقق من وجود مستخدم مسجل مسبقاً
    if (this.authService.isTokenValid()) {
      router.navigate(['/dashboard/default']);
    }
  }

  // بدء عملية تسجيل الدخول - إرسال المستخدمة إلى IdentityServer
  async login(): Promise<void> {
    await this.authService.login();
  }
}

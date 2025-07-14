import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonalInfoService, PersonalInfo } from '../../shared/services/personal-info.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-test-api',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>Test API Connection</h2>
      
      <div class="card mb-3">
        <div class="card-header">
          Authentication Status
        </div>
        <div class="card-body">
          <p><strong>Is Authenticated:</strong> {{ isAuthenticated }}</p>
          <p><strong>Token:</strong> {{ token ? 'Present' : 'Not Present' }}</p>
          <p><strong>User:</strong> {{ currentUser?.fullName || 'Not Available' }}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          API Test Results
        </div>
        <div class="card-body">
          <button class="btn btn-primary me-2" (click)="testApi()" [disabled]="loading">
            {{ loading ? 'Testing...' : 'Test API Connection' }}
          </button>
          
          <div *ngIf="error" class="alert alert-danger mt-3">
            <strong>Error:</strong> {{ error }}
          </div>
          
          <div *ngIf="apiResult" class="mt-3">
            <h5>API Response:</h5>
            <pre>{{ apiResult | json }}</pre>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
    }
    pre {
      background-color: #f8f9fa;
      padding: 1rem;
      border-radius: 0.25rem;
      overflow-x: auto;
    }
  `]
})
export class TestApiComponent implements OnInit {
  isAuthenticated = false;
  token: string | null = null;
  currentUser: any = null;
  loading = false;
  error: string | null = null;
  apiResult: any = null;

  constructor(
    private personalInfoService: PersonalInfoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.checkAuthStatus();
  }

  checkAuthStatus(): void {
    this.isAuthenticated = this.authService.isTokenValid();
    this.token = this.authService.getToken();
    this.currentUser = this.authService.getCurrentUser();
  }

  testApi(): void {
    this.loading = true;
    this.error = null;
    this.apiResult = null;

    this.personalInfoService.getAll(1, 5).subscribe({
      next: (response) => {
        this.loading = false;
        this.apiResult = response;
        console.log('API Response:', response);
      },
      error: (error) => {
        this.loading = false;
        this.error = error.message || 'An error occurred while testing the API';
        console.error('API Error:', error);
      }
    });
  }
} 
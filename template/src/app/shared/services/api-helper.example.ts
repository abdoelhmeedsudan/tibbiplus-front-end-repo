import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiHelperService, ApiResponse } from './api-helper.service';

// مثال على interface للمستخدم
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

// مثال على interface لإنشاء مستخدم جديد
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
}

// مثال على interface لتحديث مستخدم
export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly endpoint = 'users';

  constructor(private apiHelper: ApiHelperService) {
    // تعيين URL الأساسي للـ API
    this.apiHelper.setBaseUrl('https://api.example.com/v1');
    
    // إضافة token للمصادقة (إذا كان متوفر)
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.apiHelper.setAuthToken(token);
    }
  }

  /**
   * الحصول على قائمة المستخدمين
   */
  getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Observable<ApiResponse<User[]>> {
    return this.apiHelper.getList<User>(this.endpoint, params);
  }

  /**
   * الحصول على مستخدم واحد بواسطة ID
   */
  getUserById(id: number): Observable<ApiResponse<User>> {
    return this.apiHelper.getById<User>(this.endpoint, id);
  }

  /**
   * إنشاء مستخدم جديد
   */
  createUser(userData: CreateUserRequest): Observable<ApiResponse<User>> {
    return this.apiHelper.create<User>(this.endpoint, userData);
  }

  /**
   * تحديث مستخدم
   */
  updateUser(id: number, userData: UpdateUserRequest): Observable<ApiResponse<User>> {
    return this.apiHelper.update<User>(this.endpoint, id, userData);
  }

  /**
   * تحديث جزئي لمستخدم
   */
  updateUserPartial(id: number, userData: Partial<UpdateUserRequest>): Observable<ApiResponse<User>> {
    return this.apiHelper.updatePartial<User>(this.endpoint, id, userData);
  }

  /**
   * حذف مستخدم
   */
  deleteUser(id: number): Observable<ApiResponse<void>> {
    return this.apiHelper.deleteById<void>(this.endpoint, id);
  }

  /**
   * تحميل صورة للمستخدم
   */
  uploadUserAvatar(userId: number, file: File): Observable<ApiResponse<{ avatar_url: string }>> {
    return this.apiHelper.uploadFile<{ avatar_url: string }>(`${this.endpoint}/${userId}/avatar`, file);
  }

  /**
   * تغيير كلمة المرور
   */
  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.apiHelper.patch<void>(`${this.endpoint}/${userId}/password`, {
      current_password: currentPassword,
      new_password: newPassword
    });
  }

  /**
   * تفعيل/إلغاء تفعيل مستخدم
   */
  toggleUserStatus(userId: number, isActive: boolean): Observable<ApiResponse<User>> {
    return this.apiHelper.patch<User>(`${this.endpoint}/${userId}/status`, {
      is_active: isActive
    });
  }
}

// مثال على استخدام الخدمة في component
/*
import { Component, OnInit } from '@angular/core';
import { UserService, User } from './user.service';

@Component({
  selector: 'app-users',
  template: `
    <div *ngFor="let user of users">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  `
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers({ page: 1, limit: 10 }).subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data;
        }
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  createUser() {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    };

    this.userService.createUser(newUser).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('User created:', response.data);
          this.loadUsers(); // إعادة تحميل القائمة
        }
      },
      error: (error) => {
        console.error('Error creating user:', error);
      }
    });
  }

  updateUser(userId: number) {
    const updateData = {
      name: 'Updated Name',
      role: 'admin'
    };

    this.userService.updateUser(userId, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('User updated:', response.data);
          this.loadUsers();
        }
      },
      error: (error) => {
        console.error('Error updating user:', error);
      }
    });
  }

  deleteUser(userId: number) {
    if (confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      this.userService.deleteUser(userId).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('User deleted successfully');
            this.loadUsers();
          }
        },
        error: (error) => {
          console.error('Error deleting user:', error);
        }
      });
    }
  }
}
*/ 
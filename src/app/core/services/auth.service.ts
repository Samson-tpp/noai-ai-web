import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { User, AuthCredentials, RegisterData } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private dataService = inject(DataService);
  private router = inject(Router);

  isAuthenticated = computed(() => !!this.dataService.currentUser());
  currentUser = this.dataService.currentUser;

  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.dataService.loadStoredUser();
  }

  async login(credentials: AuthCredentials): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);

    // Simulate API call delay
    await this.delay(1000);

    try {
      const success = this.dataService.login(credentials.email, credentials.password);

      if (success) {
        this.isLoading.set(false);
        this.router.navigate(['/feed']);
        return true;
      } else {
        // For demo purposes, auto-login with first demo user
        if (credentials.email && credentials.password) {
          this.dataService.login('alex.morgan@noai.io', 'demo');
          this.isLoading.set(false);
          this.router.navigate(['/feed']);
          return true;
        }
        this.error.set('Invalid credentials. Try: alex.morgan@noai.io');
        this.isLoading.set(false);
        return false;
      }
    } catch (e) {
      this.error.set('An error occurred during login');
      this.isLoading.set(false);
      return false;
    }
  }

  async register(data: RegisterData): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);

    // Simulate API call delay
    await this.delay(1500);

    try {
      // For demo, just log in with the first user
      this.dataService.login('alex.morgan@noai.io', 'demo');
      this.isLoading.set(false);
      this.router.navigate(['/email-verification']);
      return true;
    } catch (e) {
      this.error.set('An error occurred during registration');
      this.isLoading.set(false);
      return false;
    }
  }

  async verifyEmail(code: string): Promise<boolean> {
    this.isLoading.set(true);
    await this.delay(1000);
    this.isLoading.set(false);

    // For demo, accept any code
    if (code.length >= 4) {
      this.router.navigate(['/feed']);
      return true;
    }
    return false;
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    this.isLoading.set(true);
    await this.delay(1000);
    this.isLoading.set(false);
    return true;
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    this.isLoading.set(true);
    await this.delay(1000);
    this.isLoading.set(false);
    return true;
  }

  logout(): void {
    this.dataService.logout();
    this.router.navigate(['/auth']);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

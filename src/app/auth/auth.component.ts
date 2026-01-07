import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col font-display bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <!-- Top Navigation -->
      <header class="w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 md:px-8 py-4 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3 text-primary dark:text-white">
            <div class="size-8 bg-primary dark:bg-white text-white dark:text-primary rounded-lg flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">shield_lock</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight">NOAI</h1>
          </div>
          <div class="flex items-center gap-4">
            <div class="hidden md:flex items-center gap-6">
              <a href="#" class="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">Platform Status</a>
              <a href="#" class="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors">Help Center</a>
            </div>

            <!-- Theme Toggle -->
            <button
              (click)="themeService.toggleTheme()"
              class="flex items-center justify-center p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-primary dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white transition-all"
            >
              <span class="material-symbols-outlined text-xl">
                {{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}
              </span>
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col lg:flex-row">

          <!-- Left Side: Login -->
          <div class="flex-1 p-6 md:p-8 lg:p-12 lg:border-r border-slate-200 dark:border-slate-700">
            <div class="max-w-md mx-auto h-full flex flex-col justify-center">
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-primary dark:text-white mb-2">Welcome Back</h2>
                <p class="text-slate-500 dark:text-slate-400 text-sm">Securely access your RooCoin wallet and feed.</p>
              </div>

              <form (ngSubmit)="onLogin()" class="space-y-6">
                <div class="space-y-1">
                  <label for="login-email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <div class="relative rounded-lg shadow-sm">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span class="material-symbols-outlined text-slate-400 text-xl">person</span>
                    </div>
                    <input
                      type="email"
                      id="login-email"
                      [(ngModel)]="loginEmail"
                      name="loginEmail"
                      class="block w-full rounded-lg border border-slate-300 dark:border-slate-600 pl-10 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-700 dark:text-white"
                      placeholder="user@noai.io"
                    >
                  </div>
                </div>

                <div class="space-y-1">
                  <label for="login-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                  <div class="relative rounded-lg shadow-sm">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span class="material-symbols-outlined text-slate-400 text-xl">key</span>
                    </div>
                    <input
                      [type]="showLoginPassword() ? 'text' : 'password'"
                      id="login-password"
                      [(ngModel)]="loginPassword"
                      name="loginPassword"
                      class="block w-full rounded-lg border border-slate-300 dark:border-slate-600 pl-10 pr-10 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-700 dark:text-white"
                      placeholder="Enter your password"
                    >
                    <button
                      type="button"
                      (click)="showLoginPassword.set(!showLoginPassword())"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <span class="material-symbols-outlined text-xl">
                        {{ showLoginPassword() ? 'visibility_off' : 'visibility' }}
                      </span>
                    </button>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      [(ngModel)]="rememberMe"
                      class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary bg-white dark:bg-slate-700 dark:border-slate-600"
                    >
                    <label for="remember-me" class="ml-2 block text-sm text-slate-500 dark:text-slate-400">Trust this device</label>
                  </div>
                  <div class="text-sm">
                    <a href="#" class="font-medium text-primary hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300">Forgot password?</a>
                  </div>
                </div>

                @if (authService.error()) {
                  <div class="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
                    <span class="material-symbols-outlined text-lg">error</span>
                    {{ authService.error() }}
                  </div>
                }

                <div>
                  <button
                    type="submit"
                    [disabled]="authService.isLoading()"
                    class="flex w-full justify-center rounded-lg bg-primary py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    @if (authService.isLoading()) {
                      <span class="flex items-center gap-2">
                        <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Authenticating...
                      </span>
                    } @else {
                      <span class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-lg">lock_open</span>
                        Access Account
                      </span>
                    }
                  </button>
                </div>
              </form>

              <div class="mt-6 text-center">
                <p class="text-xs text-slate-400 dark:text-slate-500">
                  Demo: Use any email/password to login
                </p>
              </div>

              <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
                <p class="text-xs text-slate-500 dark:text-slate-500">
                  Authorized personnel only. All access attempts are logged and monitored.
                </p>
              </div>
            </div>
          </div>

          <!-- Right Side: Registration -->
          <div class="flex-1 p-6 md:p-8 lg:p-12 bg-slate-50/50 dark:bg-slate-900/50">
            <div class="max-w-md mx-auto h-full flex flex-col justify-center">
              <div class="mb-8">
                <h2 class="text-2xl font-bold text-primary dark:text-white mb-2">Join NOAI</h2>
                <p class="text-slate-500 dark:text-slate-400 text-sm">Verify your humanity. Start earning RooCoin.</p>
              </div>

              <form (ngSubmit)="onRegister()" class="space-y-5">
                <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div class="space-y-1">
                    <label for="first-name" class="block text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                    <input
                      type="text"
                      id="first-name"
                      [(ngModel)]="registerFirstName"
                      name="firstName"
                      class="block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-700 dark:text-white"
                      placeholder="Jane"
                    >
                  </div>
                  <div class="space-y-1">
                    <label for="last-name" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                    <input
                      type="text"
                      id="last-name"
                      [(ngModel)]="registerLastName"
                      name="lastName"
                      class="block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-700 dark:text-white"
                      placeholder="Doe"
                    >
                  </div>
                </div>

                <div class="space-y-1">
                  <label for="reg-email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                  <input
                    type="email"
                    id="reg-email"
                    [(ngModel)]="registerEmail"
                    name="regEmail"
                    class="block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-700 dark:text-white"
                    placeholder="jane.doe@example.com"
                  >
                </div>

                <div class="space-y-1">
                  <label for="reg-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Create Password</label>
                  <div class="relative">
                    <input
                      [type]="showRegPassword() ? 'text' : 'password'"
                      id="reg-password"
                      [(ngModel)]="registerPassword"
                      name="regPassword"
                      class="block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 pr-10 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-700 dark:text-white"
                      placeholder="Minimum 8 characters"
                    >
                    <button
                      type="button"
                      (click)="showRegPassword.set(!showRegPassword())"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
                    >
                      <span class="material-symbols-outlined text-xl">
                        {{ showRegPassword() ? 'visibility_off' : 'visibility' }}
                      </span>
                    </button>
                  </div>
                  <!-- Password Strength Indicator -->
                  <div class="flex gap-1 mt-2 h-1">
                    @for (i of [1,2,3,4]; track i) {
                      <div class="flex-1 rounded-full overflow-hidden"
                        [class]="i <= passwordStrength() ? getStrengthColor() : 'bg-slate-200 dark:bg-slate-700'">
                      </div>
                    }
                  </div>
                  <p class="text-xs text-slate-500 mt-1">Strength: {{ getStrengthText() }}</p>
                </div>

                <div class="space-y-1">
                  <label for="confirm-password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                  <input
                    type="password"
                    id="confirm-password"
                    [(ngModel)]="registerConfirmPassword"
                    name="confirmPassword"
                    class="block w-full rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-700 dark:text-white"
                    placeholder="Re-enter password"
                  >
                </div>

                <div class="flex items-start">
                  <div class="flex h-5 items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      [(ngModel)]="agreeToTerms"
                      class="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary bg-white dark:bg-slate-700 dark:border-slate-600"
                    >
                  </div>
                  <div class="ml-3 text-sm">
                    <label for="terms" class="text-slate-500 dark:text-slate-400">
                      I agree to the <a href="#" class="text-primary hover:underline dark:text-white font-medium">Terms of Service</a> and strict <a href="#" class="text-primary hover:underline dark:text-white font-medium">No-AI Policy</a>.
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  [disabled]="authService.isLoading()"
                  class="flex w-full justify-center rounded-lg bg-primary/10 border-2 border-primary/20 py-3 px-4 text-sm font-bold text-primary dark:text-white dark:bg-white/10 dark:border-white/20 hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary transition-all disabled:opacity-50"
                >
                  @if (authService.isLoading()) {
                    <span class="flex items-center gap-2">
                      <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  } @else {
                    <span class="flex items-center gap-2">
                      <span class="material-symbols-outlined text-lg">verified_user</span>
                      Create Secure ID
                    </span>
                  }
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-xs text-slate-500 dark:text-slate-500">&copy; 2024 NOAI Inc. All rights reserved. Bank-grade security standards applied.</p>
          <div class="flex gap-6">
            <a href="#" class="text-xs text-slate-500 hover:text-primary dark:text-slate-500 dark:hover:text-white">Privacy Policy</a>
            <a href="#" class="text-xs text-slate-500 hover:text-primary dark:text-slate-500 dark:hover:text-white">Terms of Service</a>
            <a href="#" class="text-xs text-slate-500 hover:text-primary dark:text-slate-500 dark:hover:text-white">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  `
})
export class AuthComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  toastService = inject(ToastService);
  router = inject(Router);

  // Login form
  loginEmail = '';
  loginPassword = '';
  rememberMe = false;
  showLoginPassword = signal(false);

  // Register form
  registerFirstName = '';
  registerLastName = '';
  registerEmail = '';
  registerPassword = '';
  registerConfirmPassword = '';
  agreeToTerms = false;
  showRegPassword = signal(false);

  passwordStrength = signal(0);

  constructor() {
    // Watch password changes for strength indicator
  }

  ngDoCheck() {
    this.calculatePasswordStrength();
  }

  calculatePasswordStrength(): void {
    const password = this.registerPassword;
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;

    this.passwordStrength.set(strength);
  }

  getStrengthColor(): string {
    const strength = this.passwordStrength();
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    return 'bg-emerald-500';
  }

  getStrengthText(): string {
    const strength = this.passwordStrength();
    if (strength === 0) return 'Very Weak';
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  }

  async onLogin(): Promise<void> {
    if (!this.loginEmail || !this.loginPassword) {
      this.toastService.warning('Please fill in all fields');
      return;
    }

    const success = await this.authService.login({
      email: this.loginEmail,
      password: this.loginPassword,
      rememberMe: this.rememberMe
    });

    if (success) {
      this.toastService.success('Welcome back!', 'You have successfully logged in.');
    }
  }

  async onRegister(): Promise<void> {
    if (!this.registerFirstName || !this.registerLastName || !this.registerEmail || !this.registerPassword) {
      this.toastService.warning('Please fill in all fields');
      return;
    }

    if (this.registerPassword !== this.registerConfirmPassword) {
      this.toastService.error('Passwords do not match');
      return;
    }

    if (!this.agreeToTerms) {
      this.toastService.warning('Please agree to the Terms of Service');
      return;
    }

    const success = await this.authService.register({
      firstName: this.registerFirstName,
      lastName: this.registerLastName,
      email: this.registerEmail,
      password: this.registerPassword,
      confirmPassword: this.registerConfirmPassword,
      agreeToTerms: this.agreeToTerms
    });

    if (success) {
      this.toastService.success('Account created!', 'Please verify your email.');
    }
  }
}

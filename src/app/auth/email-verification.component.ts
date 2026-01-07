import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { ThemeService } from '../core/services/theme.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-email-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex flex-col font-display bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <!-- Header -->
      <header class="w-full bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 md:px-8 py-4">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-3 text-primary dark:text-white">
            <div class="size-8 bg-primary dark:bg-white text-white dark:text-primary rounded-lg flex items-center justify-center">
              <span class="material-symbols-outlined text-xl">shield_lock</span>
            </div>
            <h1 class="text-xl font-bold tracking-tight">NOAI</h1>
          </div>
          <button
            (click)="themeService.toggleTheme()"
            class="flex items-center justify-center p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 transition-all"
          >
            <span class="material-symbols-outlined text-xl">
              {{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}
            </span>
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-grow flex items-center justify-center py-12 px-4">
        <div class="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center size-16 bg-primary/10 dark:bg-white/10 rounded-full mb-4">
              <span class="material-symbols-outlined text-primary dark:text-white text-3xl">mark_email_read</span>
            </div>
            <h2 class="text-2xl font-bold text-primary dark:text-white mb-2">Verify Your Email</h2>
            <p class="text-slate-500 dark:text-slate-400 text-sm">
              We've sent a verification code to your email address. Enter the code below to complete your registration.
            </p>
          </div>

          <form (ngSubmit)="onVerify()" class="space-y-6">
            <!-- Code Input -->
            <div class="flex justify-center gap-3">
              @for (i of [0,1,2,3,4,5]; track i) {
                <input
                  type="text"
                  maxlength="1"
                  class="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-slate-300 dark:border-slate-600 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-slate-700 dark:text-white transition-all"
                  [(ngModel)]="codeDigits[i]"
                  [name]="'digit' + i"
                  (input)="onDigitInput($event, i)"
                  (keydown)="onDigitKeydown($event, i)"
                  [id]="'digit-' + i"
                >
              }
            </div>

            <button
              type="submit"
              [disabled]="isLoading()"
              class="flex w-full justify-center rounded-lg bg-primary py-3 px-4 text-sm font-bold text-white shadow-sm hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              @if (isLoading()) {
                <span class="flex items-center gap-2">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              } @else {
                <span class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-lg">verified</span>
                  Verify Email
                </span>
              }
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-sm text-slate-500 dark:text-slate-400">
              Didn't receive the code?
              <button
                (click)="resendCode()"
                class="text-primary dark:text-white font-medium hover:underline ml-1"
                [disabled]="resendCountdown() > 0"
              >
                @if (resendCountdown() > 0) {
                  Resend in {{ resendCountdown() }}s
                } @else {
                  Resend Code
                }
              </button>
            </p>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <button
              (click)="goBack()"
              class="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors w-full"
            >
              <span class="material-symbols-outlined text-lg">arrow_back</span>
              Back to Login
            </button>
          </div>
        </div>
      </main>
    </div>
  `
})
export class EmailVerificationComponent {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  toastService = inject(ToastService);
  router = inject(Router);

  codeDigits: string[] = ['', '', '', '', '', ''];
  isLoading = signal(false);
  resendCountdown = signal(0);

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && index < 5) {
      const nextInput = document.getElementById(`digit-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    }
  }

  onDigitKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.codeDigits[index] && index > 0) {
      const prevInput = document.getElementById(`digit-${index - 1}`) as HTMLInputElement;
      prevInput?.focus();
    }
  }

  async onVerify(): Promise<void> {
    const code = this.codeDigits.join('');
    if (code.length !== 6) {
      this.toastService.warning('Please enter the complete verification code');
      return;
    }

    this.isLoading.set(true);
    const success = await this.authService.verifyEmail(code);
    this.isLoading.set(false);

    if (success) {
      this.toastService.success('Email verified!', 'Welcome to NOAI.');
    } else {
      this.toastService.error('Invalid code', 'Please try again.');
    }
  }

  resendCode(): void {
    if (this.resendCountdown() > 0) return;

    this.toastService.info('Code sent', 'A new verification code has been sent to your email.');
    this.resendCountdown.set(60);

    const interval = setInterval(() => {
      this.resendCountdown.update(v => {
        if (v <= 1) {
          clearInterval(interval);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  goBack(): void {
    this.router.navigate(['/auth']);
  }
}

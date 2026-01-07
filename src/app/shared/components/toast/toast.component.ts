import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="animate-slide-up rounded-lg shadow-lg border p-4 flex items-start gap-3"
          [class]="getToastClasses(toast.type)"
        >
          <span class="material-symbols-outlined text-xl" [class]="getIconClass(toast.type)">
            {{ getIcon(toast.type) }}
          </span>
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-sm">{{ toast.title }}</p>
            @if (toast.message) {
              <p class="text-sm opacity-80 mt-0.5">{{ toast.message }}</p>
            }
          </div>
          <button
            (click)="toastService.dismiss(toast.id)"
            class="text-current opacity-50 hover:opacity-100 transition-opacity"
          >
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);

  getToastClasses(type: string): string {
    const base = 'backdrop-blur-sm';
    switch (type) {
      case 'success':
        return `${base} bg-emerald-50 dark:bg-emerald-900/90 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-100`;
      case 'error':
        return `${base} bg-red-50 dark:bg-red-900/90 border-red-200 dark:border-red-700 text-red-800 dark:text-red-100`;
      case 'warning':
        return `${base} bg-amber-50 dark:bg-amber-900/90 border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-100`;
      default:
        return `${base} bg-blue-50 dark:bg-blue-900/90 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-100`;
    }
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'text-emerald-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      default:
        return 'text-blue-500';
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  }
}

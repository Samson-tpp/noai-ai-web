import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    // Load saved preference
    const saved = localStorage.getItem('noai_theme');
    if (saved) {
      this.isDarkMode.set(saved === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }

    // Apply theme on changes
    effect(() => {
      this.applyTheme();
    });
  }

  toggleTheme(): void {
    this.isDarkMode.update(v => !v);
    localStorage.setItem('noai_theme', this.isDarkMode() ? 'dark' : 'light');
  }

  setDarkMode(value: boolean): void {
    this.isDarkMode.set(value);
    localStorage.setItem('noai_theme', value ? 'dark' : 'light');
  }

  private applyTheme(): void {
    if (typeof document !== 'undefined') {
      if (this.isDarkMode()) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
}

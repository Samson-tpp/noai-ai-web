import { Component, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { DataService } from '../core/services/data.service';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen flex flex-col font-display bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <!-- Top Navigation -->
      <header class="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 h-16">
        <div class="max-w-[1440px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <!-- Logo -->
          <div class="flex items-center gap-3 min-w-fit">
            <div class="size-9 bg-primary dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-primary shadow-sm">
              <span class="material-symbols-outlined text-xl">shield_lock</span>
            </div>
            <h1 class="text-primary dark:text-white font-bold text-xl tracking-tight hidden sm:block">NOAI</h1>
          </div>

          <!-- Search -->
          <div class="hidden md:flex flex-1 max-w-lg">
            <div class="relative w-full group">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <span class="material-symbols-outlined text-xl">search</span>
              </div>
              <input
                type="text"
                class="block w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
                placeholder="Search posts, users, or topics..."
              >
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <kbd class="hidden sm:inline-flex items-center border border-slate-200 dark:border-slate-600 rounded px-2 py-0.5 text-xs font-mono text-slate-400 bg-white dark:bg-slate-800">
                  Ctrl+K
                </kbd>
              </div>
            </div>
          </div>

          <!-- Right Actions -->
          <div class="flex items-center gap-3">
            <!-- RooCoin Balance -->
            <a
              routerLink="/wallet"
              class="hidden sm:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl border border-amber-200 dark:border-amber-700 hover:shadow-md transition-all cursor-pointer"
            >
              <span class="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg">account_balance_wallet</span>
              <span class="text-sm font-bold text-amber-700 dark:text-amber-300 font-mono">
                {{ formatBalance(dataService.currentUser()?.rooCoinBalance || 0) }} ROO
              </span>
            </a>

            <!-- Notifications -->
            <button
              routerLink="/notifications"
              class="relative p-2.5 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <span class="material-symbols-outlined text-xl">notifications</span>
              @if (dataService.unreadNotificationsCount() > 0) {
                <span class="absolute top-1.5 right-1.5 size-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse"></span>
              }
            </button>

            <!-- Theme Toggle -->
            <button
              (click)="themeService.toggleTheme()"
              class="p-2.5 text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <span class="material-symbols-outlined text-xl">
                {{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}
              </span>
            </button>

            <!-- Profile Menu -->
            <div class="relative" #profileMenuContainer>
              <button
                (click)="toggleProfileMenu($event)"
                class="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <div
                  class="h-9 w-9 rounded-xl bg-cover bg-center border-2 border-slate-200 dark:border-slate-600 shadow-sm"
                  [style.background-image]="'url(' + (dataService.currentUser()?.avatar || 'https://ui-avatars.com/api/?name=User') + ')'"
                ></div>
                <span class="material-symbols-outlined text-slate-400 text-lg hidden sm:block">
                  expand_more
                </span>
              </button>

              @if (showProfileMenu()) {
                <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 animate-slide-down z-50">
                  <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                    <p class="text-sm font-bold text-slate-900 dark:text-white">
                      {{ dataService.currentUser()?.firstName }} {{ dataService.currentUser()?.lastName }}
                    </p>
                    <p class="text-xs text-slate-500">{{ '@' + dataService.currentUser()?.username }}</p>
                  </div>
                  <a routerLink="/profile" (click)="closeProfileMenu()" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <span class="material-symbols-outlined text-lg">person</span>
                    My Profile
                  </a>
                  <a routerLink="/settings" (click)="closeProfileMenu()" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <span class="material-symbols-outlined text-lg">settings</span>
                    Settings
                  </a>
                  <a routerLink="/support" (click)="closeProfileMenu()" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <span class="material-symbols-outlined text-lg">help</span>
                    Help & Support
                  </a>
                  <div class="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                    <button
                      (click)="logout()"
                      class="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full"
                    >
                      <span class="material-symbols-outlined text-lg">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </header>

      <div class="flex flex-1 w-full max-w-[1440px] mx-auto">
        <!-- Side Navigation -->
        <aside class="hidden lg:flex flex-col w-64 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav class="flex flex-col gap-1">
            @for (item of navItems; track item.route) {
              <a
                [routerLink]="item.route"
                routerLinkActive="bg-primary/10 dark:bg-white/10 text-primary dark:text-white border-primary/20 dark:border-white/20"
                [routerLinkActiveOptions]="{ exact: item.exact }"
                class="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl font-medium text-sm transition-colors border border-transparent"
              >
                <span class="material-symbols-outlined" [class.filled]="isActive(item.route)">{{ item.icon }}</span>
                {{ item.label }}
                @if (item.badge) {
                  <span class="ml-auto px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                    {{ item.badge }}
                  </span>
                }
              </a>
            }
          </nav>

          <!-- RooCoin Ticker -->
          <div class="mt-6 bg-gradient-to-br from-primary to-slate-800 dark:from-slate-700 dark:to-slate-800 rounded-xl p-4 text-white shadow-lg">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-300">RooCoin</span>
              <span class="material-symbols-outlined text-emerald-400 text-sm">trending_up</span>
            </div>
            <div class="flex items-end gap-2">
              <span class="text-2xl font-bold font-mono">\${{ dataService.rooCoinMarket().price.toFixed(3) }}</span>
              <span class="text-xs text-emerald-400 font-medium mb-1">+{{ dataService.rooCoinMarket().change24h }}%</span>
            </div>
            <div class="mt-3 pt-3 border-t border-white/20 flex justify-between text-xs text-slate-300">
              <span>Vol: {{ formatVolume(dataService.rooCoinMarket().volume24h) }}</span>
              <span>Cap: {{ formatVolume(dataService.rooCoinMarket().marketCap) }}</span>
            </div>
          </div>

          <!-- Footer Links -->
          <div class="mt-auto pt-6 px-4 text-xs text-slate-400 flex flex-wrap gap-x-4 gap-y-2">
            <a href="#" class="hover:underline">Privacy</a>
            <a href="#" class="hover:underline">Terms</a>
            <a href="#" class="hover:underline">Help</a>
            <span class="w-full">&copy; 2024 NOAI Inc.</span>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 min-h-[calc(100vh-4rem)] p-4 lg:p-6 pb-24 lg:pb-6">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Mobile Bottom Navigation -->
      <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-2 py-2 z-40">
        <div class="flex justify-around items-center">
          @for (item of mobileNavItems; track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="text-primary dark:text-white"
              [routerLinkActiveOptions]="{ exact: item.exact }"
              class="flex flex-col items-center gap-1 px-3 py-2 text-slate-500 dark:text-slate-400 rounded-xl transition-colors relative"
            >
              <span class="material-symbols-outlined text-xl" [class.filled]="isActive(item.route)">{{ item.icon }}</span>
              <span class="text-[10px] font-medium">{{ item.label }}</span>
              @if (item.badge) {
                <span class="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
              }
            </a>
          }
        </div>
      </nav>
    </div>
  `
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  dataService = inject(DataService);
  themeService = inject(ThemeService);
  router = inject(Router);

  showProfileMenu = signal(false);

  navItems = [
    { route: '/feed', label: 'Home Feed', icon: 'home', exact: true },
    { route: '/discover', label: 'Discover', icon: 'explore', exact: false },
    { route: '/create', label: 'Create Post', icon: 'edit_square', exact: false },
    { route: '/wallet', label: 'Wallet', icon: 'account_balance_wallet', exact: false },
    { route: '/staking', label: 'Staking', icon: 'savings', exact: false },
    { route: '/notifications', label: 'Notifications', icon: 'notifications', exact: false, badge: this.dataService.unreadNotificationsCount() || undefined },
    { route: '/appeals', label: 'Appeals', icon: 'gavel', exact: false },
    { route: '/profile', label: 'My Profile', icon: 'person', exact: false },
    { route: '/settings', label: 'Settings', icon: 'settings', exact: false },
  ];

  mobileNavItems: { route: string; label: string; icon: string; exact: boolean; badge?: number }[] = [
    { route: '/feed', label: 'Home', icon: 'home', exact: true },
    { route: '/discover', label: 'Discover', icon: 'explore', exact: false },
    { route: '/create', label: 'Create', icon: 'add_circle', exact: false },
    { route: '/wallet', label: 'Wallet', icon: 'account_balance_wallet', exact: false },
    { route: '/profile', label: 'Profile', icon: 'person', exact: false },
  ];

  isActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  formatBalance(balance: number): string {
    return balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  formatVolume(volume: number): string {
    if (volume >= 1000000) {
      return (volume / 1000000).toFixed(1) + 'M';
    }
    if (volume >= 1000) {
      return (volume / 1000).toFixed(1) + 'K';
    }
    return volume.toString();
  }

  toggleProfileMenu(event: Event): void {
    event.stopPropagation();
    this.showProfileMenu.set(!this.showProfileMenu());
  }

  closeProfileMenu(): void {
    this.showProfileMenu.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Close profile menu when clicking outside
    if (this.showProfileMenu()) {
      this.showProfileMenu.set(false);
    }
  }

  logout(): void {
    this.showProfileMenu.set(false);
    this.authService.logout();
  }
}

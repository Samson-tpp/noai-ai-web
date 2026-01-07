import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ThemeService } from '../../core/services/theme.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-8">Settings</h1>

      <div class="space-y-6">
        <!-- Profile Settings -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
            <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-slate-400">person</span>
              Profile Settings
            </h2>
          </div>
          <div class="p-6 space-y-6">
            <div class="flex items-center gap-6">
              <div
                class="w-20 h-20 rounded-2xl bg-cover bg-center border-2 border-slate-200 dark:border-slate-600"
                [style.background-image]="'url(' + dataService.currentUser()?.avatar + ')'"
              ></div>
              <div>
                <button class="px-4 py-2 bg-primary dark:bg-white text-white dark:text-primary text-sm font-medium rounded-lg hover:bg-primary/90 dark:hover:bg-slate-100 transition-colors">
                  Change Photo
                </button>
                <p class="text-xs text-slate-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">First Name</label>
                <input
                  type="text"
                  [value]="dataService.currentUser()?.firstName"
                  class="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Last Name</label>
                <input
                  type="text"
                  [value]="dataService.currentUser()?.lastName"
                  class="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Username</label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">@</span>
                <input
                  type="text"
                  [value]="dataService.currentUser()?.username"
                  class="w-full h-11 pl-8 pr-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bio</label>
              <textarea
                [value]="dataService.currentUser()?.bio"
                class="w-full h-24 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Appearance -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
            <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-slate-400">palette</span>
              Appearance
            </h2>
          </div>
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                <p class="text-sm text-slate-500">Switch between light and dark themes</p>
              </div>
              <button
                (click)="themeService.toggleTheme()"
                class="relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                [class]="themeService.isDarkMode() ? 'bg-primary' : 'bg-slate-200'"
              >
                <span
                  class="pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                  [class]="themeService.isDarkMode() ? 'translate-x-5' : 'translate-x-0'"
                ></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Notifications -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
            <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-slate-400">notifications</span>
              Notifications
            </h2>
          </div>
          <div class="p-6 space-y-4">
            @for (setting of notificationSettings; track setting.id) {
              <div class="flex items-center justify-between py-2">
                <div>
                  <p class="font-medium text-slate-900 dark:text-white">{{ setting.label }}</p>
                  <p class="text-sm text-slate-500">{{ setting.description }}</p>
                </div>
                <button
                  (click)="setting.enabled = !setting.enabled"
                  class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                  [class]="setting.enabled ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-600'"
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    [class]="setting.enabled ? 'translate-x-5' : 'translate-x-0'"
                  ></span>
                </button>
              </div>
            }
          </div>
        </div>

        <!-- Security -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
            <h2 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span class="material-symbols-outlined text-slate-400">security</span>
              Security
            </h2>
          </div>
          <div class="p-6 space-y-4">
            <button class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-slate-400">key</span>
                <div class="text-left">
                  <p class="font-medium text-slate-900 dark:text-white">Change Password</p>
                  <p class="text-sm text-slate-500">Update your account password</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
            <button class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-slate-400">smartphone</span>
                <div class="text-left">
                  <p class="font-medium text-slate-900 dark:text-white">Two-Factor Authentication</p>
                  <p class="text-sm text-slate-500">Add an extra layer of security</p>
                </div>
              </div>
              <span class="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded">Enabled</span>
            </button>
            <button class="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-slate-400">devices</span>
                <div class="text-left">
                  <p class="font-medium text-slate-900 dark:text-white">Active Sessions</p>
                  <p class="text-sm text-slate-500">Manage your active login sessions</p>
                </div>
              </div>
              <span class="material-symbols-outlined text-slate-400">chevron_right</span>
            </button>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end gap-3">
          <button class="px-6 py-3 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            Cancel
          </button>
          <button
            (click)="saveSettings()"
            class="px-6 py-3 rounded-xl bg-primary dark:bg-white text-white dark:text-primary font-bold hover:bg-primary/90 dark:hover:bg-slate-100 transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  `
})
export class SettingsComponent {
  dataService = inject(DataService);
  themeService = inject(ThemeService);
  toastService = inject(ToastService);

  notificationSettings = [
    { id: 'endorsements', label: 'Endorsements', description: 'When someone endorses your content', enabled: true },
    { id: 'comments', label: 'Comments & Replies', description: 'When someone comments on your posts', enabled: true },
    { id: 'moderation', label: 'Moderation Alerts', description: 'When content is flagged or reviewed', enabled: true },
    { id: 'staking', label: 'Staking Rewards', description: 'When you receive staking payouts', enabled: true },
    { id: 'marketing', label: 'Platform Updates', description: 'News and feature announcements', enabled: false },
  ];

  saveSettings(): void {
    this.toastService.success('Settings saved!', 'Your preferences have been updated.');
  }
}

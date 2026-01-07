import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { Notification } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
        <button
          (click)="markAllAsRead()"
          class="text-sm text-primary dark:text-white font-bold hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <!-- Notifications List -->
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
        @for (notification of dataService.notifications(); track notification.id) {
          <div
            (click)="markAsRead(notification)"
            class="p-5 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer relative"
            [class.bg-primary/5]="!notification.isRead"
            [class.dark:bg-white/5]="!notification.isRead"
          >
            @if (!notification.isRead) {
              <div class="absolute top-5 right-5 size-2.5 bg-primary dark:bg-white rounded-full"></div>
            }
            <div class="flex gap-4">
              <div
                class="size-12 rounded-xl flex items-center justify-center flex-shrink-0"
                [class]="getIconContainerClass(notification)"
              >
                <span class="material-symbols-outlined" [class.filled]="notification.icon">
                  {{ getNotificationIcon(notification) }}
                </span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-slate-900 dark:text-white leading-relaxed">
                  <span class="font-bold">{{ notification.title }}</span>
                  <span class="text-slate-600 dark:text-slate-300"> - {{ notification.message }}</span>
                </p>
                <p class="text-xs text-slate-400 mt-2">{{ getTimeAgo(notification.createdAt) }}</p>
              </div>
            </div>
          </div>
        }

        @if (dataService.notifications().length === 0) {
          <div class="p-12 text-center">
            <span class="material-symbols-outlined text-5xl text-slate-300 dark:text-slate-600 mb-4">notifications_off</span>
            <p class="text-slate-500">No notifications yet</p>
          </div>
        }
      </div>
    </div>
  `
})
export class NotificationsComponent {
  dataService = inject(DataService);

  getNotificationIcon(notification: Notification): string {
    if (notification.icon) return notification.icon;

    const icons: Record<string, string> = {
      post_verified: 'verified',
      post_flagged: 'warning',
      comment_reply: 'chat_bubble',
      endorsement: 'thumb_up',
      follow: 'person_add',
      mention: 'alternate_email',
      moderation_alert: 'gavel',
      appeal_update: 'gavel',
      staking_reward: 'savings',
      system: 'info',
      roocoin: 'account_balance_wallet',
    };
    return icons[notification.type] || 'notifications';
  }

  getIconContainerClass(notification: Notification): string {
    const color = notification.iconColor || this.getDefaultColor(notification.type);

    const classes: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      green: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      emerald: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    };
    return classes[color] || 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
  }

  getDefaultColor(type: string): string {
    const colors: Record<string, string> = {
      post_verified: 'blue',
      post_flagged: 'orange',
      comment_reply: 'blue',
      endorsement: 'emerald',
      follow: 'purple',
      mention: 'blue',
      moderation_alert: 'orange',
      appeal_update: 'green',
      staking_reward: 'green',
      system: 'blue',
      roocoin: 'orange',
    };
    return colors[type] || 'blue';
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  }

  markAsRead(notification: Notification): void {
    if (!notification.isRead) {
      this.dataService.markNotificationAsRead(notification.id);
    }
  }

  markAllAsRead(): void {
    this.dataService.markAllNotificationsAsRead();
  }
}

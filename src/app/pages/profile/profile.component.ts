import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-5xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="flex text-sm font-medium text-slate-500 mb-6">
        <a routerLink="/feed" class="hover:text-primary dark:hover:text-white transition-colors">Home</a>
        <span class="mx-2">/</span>
        <span class="text-slate-900 dark:text-white">My Profile</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Profile Sidebar -->
        <aside class="lg:col-span-4 space-y-6">
          <!-- Profile Card -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div class="flex flex-col items-center text-center">
              <!-- Avatar -->
              <div class="relative mb-4">
                <div
                  class="w-28 h-28 rounded-2xl bg-cover bg-center border-2 border-slate-200 dark:border-slate-600 shadow-lg"
                  [style.background-image]="'url(' + user()?.avatar + ')'"
                ></div>
                <div class="absolute -bottom-2 -right-2 bg-white dark:bg-slate-800 p-1.5 rounded-full border-2 border-slate-200 dark:border-slate-600 shadow">
                  <span class="material-symbols-outlined text-emerald-500 text-xl filled">check_circle</span>
                </div>
              </div>

              <h1 class="text-xl font-bold text-slate-900 dark:text-white">
                {{ user()?.firstName }} {{ user()?.lastName }}
              </h1>
              <p class="text-sm text-slate-500 mb-1">{{ '@' + user()?.username }}</p>
              <p class="text-xs text-slate-400 mb-4">Member since {{ formatDate(user()?.joinDate) }}</p>

              <!-- Badges -->
              <div class="flex flex-wrap justify-center gap-2 mb-6">
                @for (badge of user()?.badges; track badge.id) {
                  <span
                    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border"
                    [class]="getBadgeClass(badge.color)"
                  >
                    <span class="material-symbols-outlined text-sm">{{ badge.icon }}</span>
                    {{ badge.name }}
                  </span>
                }
              </div>

              <div class="w-full border-t border-slate-200 dark:border-slate-700 my-4"></div>

              <!-- RooCoin Balance -->
              <div class="w-full flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-slate-500">RooCoin Balance</span>
                <span class="text-sm font-bold font-mono text-slate-900 dark:text-white">
                  {{ user()?.rooCoinBalance?.toLocaleString() }} ROO
                </span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-6">
                <div class="bg-primary dark:bg-white h-2 rounded-full" style="width: 75%"></div>
              </div>

              <button class="w-full flex items-center justify-center gap-2 rounded-xl h-11 px-4 bg-primary/10 dark:bg-white/10 border border-primary/20 dark:border-white/20 text-primary dark:text-white text-sm font-bold transition-colors hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-primary">
                <span class="material-symbols-outlined text-lg">edit</span>
                Edit Profile
              </button>
            </div>
          </div>

          <!-- Humanity Metrics -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div class="bg-slate-50 dark:bg-slate-700/50 px-5 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Humanity Metrics</h3>
              <span class="material-symbols-outlined text-slate-400 text-lg cursor-help" title="Your trust and verification scores">info</span>
            </div>
            <div class="divide-y divide-slate-100 dark:divide-slate-700">
              <div class="px-5 py-4 flex justify-between items-center">
                <div class="flex flex-col">
                  <span class="text-xs text-slate-500">Trust Score</span>
                  <span class="text-2xl font-bold text-slate-900 dark:text-white">
                    {{ user()?.trustScore }}<span class="text-sm font-normal text-slate-400">/100</span>
                  </span>
                </div>
                <div class="h-12 w-12 rounded-full border-4 border-emerald-500 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30">
                  <span class="text-sm font-bold text-emerald-600 dark:text-emerald-400">A+</span>
                </div>
              </div>
              <div class="px-5 py-4 flex justify-between items-center">
                <div class="flex flex-col">
                  <span class="text-xs text-slate-500">Human-Verified Posts</span>
                  <span class="text-lg font-bold text-slate-900 dark:text-white">{{ user()?.stats?.humanVerifiedPosts }}</span>
                </div>
                <span class="material-symbols-outlined text-slate-400">post_add</span>
              </div>
              <div class="px-5 py-4 flex justify-between items-center">
                <div class="flex flex-col">
                  <span class="text-xs text-slate-500">Endorsements Received</span>
                  <span class="text-lg font-bold text-slate-900 dark:text-white">{{ user()?.stats?.endorsementsReceived?.toLocaleString() }}</span>
                </div>
                <span class="material-symbols-outlined text-slate-400">thumb_up</span>
              </div>
              <div class="px-5 py-4 flex justify-between items-center">
                <div class="flex flex-col">
                  <span class="text-xs text-slate-500">Reputation Score</span>
                  <span class="text-lg font-bold text-slate-900 dark:text-white">{{ user()?.stats?.reputationScore }}<span class="text-sm font-normal text-slate-400">/1000</span></span>
                </div>
                <span class="material-symbols-outlined text-amber-500">workspace_premium</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <div class="lg:col-span-8 space-y-6">
          <!-- Tabs -->
          <div class="border-b border-slate-200 dark:border-slate-700 flex gap-8 px-2">
            @for (tab of tabs; track tab.id) {
              <button
                (click)="activeTab.set(tab.id)"
                class="pb-4 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors"
                [class]="activeTab() === tab.id
                  ? 'border-primary dark:border-white text-primary dark:text-white'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'"
              >
                <span class="material-symbols-outlined text-lg">{{ tab.icon }}</span>
                {{ tab.label }}
              </button>
            }
          </div>

          <!-- Activity Tab -->
          @if (activeTab() === 'activity') {
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <!-- Header -->
              <div class="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <div class="col-span-6 md:col-span-7 pl-2">Content / Activity</div>
                <div class="col-span-3 md:col-span-2 text-right">ML Score</div>
                <div class="col-span-3 md:col-span-3 text-right pr-2">Verification</div>
              </div>

              <!-- Activity Items -->
              @for (post of userPosts(); track post.id) {
                <div class="group grid grid-cols-12 gap-4 p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors items-center">
                  <div class="col-span-6 md:col-span-7 flex flex-col gap-1 pl-2">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-[10px] font-mono text-slate-500 border border-slate-200 dark:border-slate-600 px-1.5 py-0.5 rounded bg-white dark:bg-slate-800">
                        POST #{{ post.id.split('-')[1] }}
                      </span>
                      <span class="text-xs text-slate-400">{{ getTimeAgo(post.createdAt) }}</span>
                    </div>
                    <p class="text-sm font-medium text-slate-700 dark:text-slate-300 line-clamp-2">
                      {{ post.title || post.content.substring(0, 100) }}...
                    </p>
                  </div>
                  <div class="col-span-3 md:col-span-2 text-right flex flex-col items-end justify-center">
                    <span
                      class="inline-flex items-center px-2 py-1 rounded text-xs font-bold border"
                      [class]="getScoreClass(post.aiScoreStatus)"
                    >
                      {{ post.aiScore.toFixed(2) }}% AI
                    </span>
                    <span class="text-[10px] text-slate-500 mt-1">{{ post.aiScoreStatus | titlecase }}</span>
                  </div>
                  <div class="col-span-3 md:col-span-3 text-right flex flex-col items-end justify-center pr-2">
                    @if (post.verificationMethod) {
                      <div class="flex items-center gap-1 text-primary dark:text-white text-xs font-medium">
                        <span class="material-symbols-outlined text-base text-blue-600">fingerprint</span>
                        {{ post.verificationMethod }}
                      </div>
                    }
                    @if (post.sessionId) {
                      <span class="text-[10px] text-slate-400 mt-0.5">Session: {{ post.sessionId }}</span>
                    }
                  </div>
                </div>
              }
            </div>
          }

          <!-- Stats Tab -->
          @if (activeTab() === 'stats') {
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-sm font-bold text-slate-500 uppercase">Total Posts</h4>
                  <span class="material-symbols-outlined text-slate-400">edit_square</span>
                </div>
                <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ user()?.stats?.postsCount }}</p>
                <p class="text-xs text-emerald-500 mt-1">+12 this month</p>
              </div>
              <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-sm font-bold text-slate-500 uppercase">Endorsements Given</h4>
                  <span class="material-symbols-outlined text-slate-400">thumb_up</span>
                </div>
                <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ user()?.stats?.endorsementsGiven }}</p>
              </div>
              <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-sm font-bold text-slate-500 uppercase">AI Rejections</h4>
                  <span class="material-symbols-outlined text-red-500">warning</span>
                </div>
                <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ user()?.stats?.aiRejectedPosts }}</p>
                <p class="text-xs text-slate-400 mt-1">{{ ((user()?.stats?.aiRejectedPosts || 0) / (user()?.stats?.postsCount || 1) * 100).toFixed(1) }}% rejection rate</p>
              </div>
              <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                <div class="flex items-center justify-between mb-4">
                  <h4 class="text-sm font-bold text-slate-500 uppercase">Appeal Success</h4>
                  <span class="material-symbols-outlined text-emerald-500">gavel</span>
                </div>
                <p class="text-3xl font-bold text-slate-900 dark:text-white">{{ user()?.stats?.appealSuccessRate }}%</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent {
  dataService = inject(DataService);

  user = this.dataService.currentUser;
  activeTab = signal('activity');

  tabs = [
    { id: 'activity', label: 'Activity Log', icon: 'history_edu' },
    { id: 'stats', label: 'Statistics', icon: 'bar_chart' },
  ];

  userPosts = () => {
    const userId = this.user()?.id;
    return this.dataService.posts().filter(p => p.author.id === userId);
  };

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  }

  getBadgeClass(color: string): string {
    const classes: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
      purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
      orange: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
      green: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
      emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
      gold: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
    };
    return classes[color] || classes['blue'];
  }

  getScoreClass(status: string): string {
    switch (status) {
      case 'pass':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700';
      case 'review':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700';
      case 'flagged':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';
import { Post } from '../../core/models/post.model';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
      <!-- Main Feed -->
      <section class="xl:col-span-8 flex flex-col gap-6">
        <!-- Post Composer -->
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div class="flex gap-4">
            <div
              class="h-11 w-11 rounded-xl bg-cover bg-center shrink-0 border border-slate-200 dark:border-slate-600"
              [style.background-image]="'url(' + (dataService.currentUser()?.avatar || '') + ')'"
            ></div>
            <div class="flex-1">
              <textarea
                [(ngModel)]="newPostContent"
                class="w-full border-none focus:ring-0 p-0 text-slate-900 dark:text-white placeholder-slate-400 text-base resize-none h-20 bg-transparent"
                placeholder="Share your verified insights..."
              ></textarea>
              <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 mt-3">
                <div class="flex gap-2 text-slate-500">
                  <button class="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                    <span class="material-symbols-outlined text-xl">image</span>
                  </button>
                  <button class="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors">
                    <span class="material-symbols-outlined text-xl">attach_file</span>
                  </button>
                  <div class="flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 rounded-xl text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    <span class="material-symbols-outlined text-sm">verified_user</span>
                    Identity Verified
                  </div>
                </div>
                <button
                  (click)="createPost()"
                  [disabled]="!newPostContent.trim()"
                  class="bg-primary hover:bg-primary/90 dark:bg-white dark:text-primary dark:hover:bg-slate-100 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Post</span>
                  <span class="material-symbols-outlined text-lg">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Feed Posts -->
        @for (post of dataService.posts(); track post.id) {
          <article class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <!-- Post Header -->
            <div class="p-5 flex items-start justify-between border-b border-slate-100 dark:border-slate-700">
              <div class="flex gap-3">
                <a [routerLink]="['/user', post.author.id]">
                  <div
                    class="h-11 w-11 rounded-xl bg-cover bg-center border border-slate-200 dark:border-slate-600"
                    [style.background-image]="'url(' + post.author.avatar + ')'"
                  ></div>
                </a>
                <div>
                  <div class="flex items-center gap-2">
                    <a [routerLink]="['/user', post.author.id]" class="font-bold text-slate-900 dark:text-white text-sm hover:underline">
                      {{ post.author.displayName }}
                    </a>
                    @if (post.author.isVerified) {
                      <span class="material-symbols-outlined text-emerald-500 text-lg filled" title="Verified Human">verified</span>
                    }
                    <span class="text-slate-400 text-xs">{{ '@' + post.author.username }}</span>
                  </div>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-slate-400">{{ getTimeAgo(post.createdAt) }}</span>
                    @if (post.sessionId) {
                      <span class="text-slate-300">•</span>
                      <div class="flex items-center gap-1 px-2 py-0.5 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                        <span class="material-symbols-outlined text-slate-500 text-xs">fingerprint</span>
                        <span class="text-[10px] font-mono font-medium text-slate-600 dark:text-slate-400">ID: {{ post.sessionId }}</span>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <button class="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <span class="material-symbols-outlined">more_horiz</span>
              </button>
            </div>

            <!-- Post Content -->
            <div class="p-5">
              <!-- AI Score Badge -->
              <div class="flex items-center gap-3 mb-4">
                <div
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border"
                  [class]="getAIScoreClass(post.aiScoreStatus)"
                >
                  @if (post.aiScoreStatus === 'pass') {
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  }
                  ML SCORE: {{ post.aiScore.toFixed(2) }}% [{{ post.aiScoreStatus.toUpperCase() }}]
                </div>
                @if (post.verificationMethod) {
                  <span class="text-xs text-slate-400 font-medium">Verified via {{ post.verificationMethod }}</span>
                }
              </div>

              <!-- Title -->
              @if (post.title) {
                <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-3">{{ post.title }}</h3>
              }

              <!-- Content -->
              <p class="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed whitespace-pre-line">{{ post.content }}</p>

              <!-- Media -->
              @if (post.media && post.media.length > 0) {
                <div class="mt-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  @for (media of post.media; track media.id) {
                    <div class="relative">
                      <img
                        [src]="media.url"
                        [alt]="media.caption || 'Post image'"
                        class="w-full h-auto max-h-96 object-cover"
                      >
                      @if (media.metadata?.device) {
                        <div class="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-xs text-white font-mono flex items-center gap-1">
                          <span class="material-symbols-outlined text-xs">camera_alt</span>
                          {{ media.metadata?.device }}
                        </div>
                      }
                      @if (media.metadata?.isVerified) {
                        <div class="absolute bottom-3 right-3 px-2 py-1 bg-emerald-500/90 backdrop-blur-sm rounded text-xs text-white font-medium flex items-center gap-1">
                          <span class="material-symbols-outlined text-xs filled">verified</span>
                          Verified
                        </div>
                      }
                    </div>
                  }
                </div>
              }

              <!-- Tags -->
              @if (post.tags && post.tags.length > 0) {
                <div class="flex flex-wrap gap-2 mt-4">
                  @for (tag of post.tags; track tag) {
                    <span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg">
                      #{{ tag }}
                    </span>
                  }
                </div>
              }
            </div>

            <!-- Post Actions -->
            <div class="px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div class="flex items-center gap-4 md:gap-6">
                <button
                  (click)="endorsePost(post)"
                  class="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors group"
                  [class.text-emerald-500]="post.isEndorsed"
                >
                  <span class="material-symbols-outlined" [class.filled]="post.isEndorsed">verified</span>
                  <span class="text-xs font-bold">{{ post.endorsements }}</span>
                </button>
                <button class="flex items-center gap-2 text-slate-500 hover:text-primary dark:hover:text-white transition-colors">
                  <span class="material-symbols-outlined">chat_bubble</span>
                  <span class="text-xs font-bold">{{ post.comments }}</span>
                </button>
                <button class="flex items-center gap-2 text-slate-500 hover:text-primary dark:hover:text-white transition-colors">
                  <span class="material-symbols-outlined">cached</span>
                  <span class="text-xs font-bold hidden sm:inline">{{ post.reposts }}</span>
                </button>
                <button class="flex items-center gap-2 text-slate-500 hover:text-primary dark:hover:text-white transition-colors">
                  <span class="material-symbols-outlined">bookmark</span>
                </button>
              </div>
              <button class="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors text-xs font-medium">
                <span class="material-symbols-outlined text-base">flag</span>
                <span class="hidden sm:inline">Report AI</span>
              </button>
            </div>
          </article>
        }
      </section>

      <!-- Right Sidebar -->
      <aside class="hidden xl:block xl:col-span-4 sticky top-24 space-y-6">
        <!-- Trust Leaders -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div class="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex justify-between items-center">
            <h3 class="font-bold text-slate-900 dark:text-white text-sm">Trust Leaders</h3>
            <a href="#" class="text-xs text-primary dark:text-white font-medium hover:underline">View All</a>
          </div>
          <div class="divide-y divide-slate-100 dark:divide-slate-700">
            @for (leader of dataService.trustLeaders(); track leader.id) {
              <a [routerLink]="['/user', leader.id]" class="flex items-center gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div
                  class="h-10 w-10 rounded-xl bg-cover bg-center"
                  [style.background-image]="'url(' + leader.avatar + ')'"
                ></div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ '@' + leader.username }}</p>
                    <span class="text-xs font-mono text-emerald-500 font-bold">{{ leader.trustScore }}%</span>
                  </div>
                  <p class="text-xs text-slate-500 truncate">{{ leader.bio?.substring(0, 40) }}...</p>
                </div>
              </a>
            }
          </div>
        </div>

        <!-- Daily Transparency Report -->
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
          <h3 class="font-bold text-slate-900 dark:text-white text-sm mb-4">Daily Transparency Report</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="text-slate-500">Verified Human Content</span>
                <span class="font-bold text-slate-900 dark:text-white">{{ dailyStats.verifiedContent.toLocaleString() }}</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div class="bg-emerald-500 h-2 rounded-full transition-all" [style.width.%]="dailyStats.humanPercentage"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-1.5">
                <span class="text-slate-500">AI Content Blocked</span>
                <span class="font-bold text-red-500">{{ dailyStats.aiBlocked.toLocaleString() }}</span>
              </div>
              <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div class="bg-red-500 h-2 rounded-full transition-all" [style.width.%]="100 - dailyStats.humanPercentage"></div>
              </div>
            </div>
            <div class="pt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <span class="material-symbols-outlined text-base">security</span>
                System Operational
              </div>
              <span class="relative flex h-2.5 w-2.5">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="bg-gradient-to-br from-primary to-slate-800 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-5 text-white">
          <h3 class="font-bold text-sm mb-3">Quick Actions</h3>
          <div class="space-y-2">
            <a routerLink="/create" class="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <span class="material-symbols-outlined">edit_square</span>
              <span class="text-sm font-medium">Create New Post</span>
            </a>
            <a routerLink="/staking" class="flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              <span class="material-symbols-outlined">savings</span>
              <span class="text-sm font-medium">Stake RooCoin</span>
            </a>
          </div>
        </div>
      </aside>
    </div>
  `
})
export class FeedComponent {
  dataService = inject(DataService);
  toastService = inject(ToastService);

  newPostContent = '';
  dailyStats = this.dataService.getDailyStats();

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }

  getAIScoreClass(status: string): string {
    switch (status) {
      case 'pass':
        return 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300';
      case 'review':
        return 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-300';
      case 'flagged':
        return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 text-red-700 dark:text-red-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300';
    }
  }

  createPost(): void {
    if (!this.newPostContent.trim()) return;

    this.dataService.addPost({
      content: this.newPostContent
    });

    this.toastService.success('Post created!', 'Your content is being verified.');
    this.newPostContent = '';
  }

  endorsePost(post: Post): void {
    if (!post.isEndorsed) {
      this.dataService.endorsePost(post.id);
      this.toastService.success('Endorsed!', 'You endorsed this human-verified content.');
    }
  }
}

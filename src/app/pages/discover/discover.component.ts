import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-discover',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Discover</h1>
          <p class="text-slate-500 text-sm md:text-base">Explore verified human content from the NOAI community.</p>
        </div>
        <div class="relative max-w-md w-full">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
            <span class="material-symbols-outlined text-xl">search</span>
          </div>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            class="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 placeholder-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            placeholder="Search posts, users, or topics..."
          >
        </div>
      </div>

      <!-- Categories -->
      <div class="flex gap-3 overflow-x-auto pb-4 mb-6 no-scrollbar">
        @for (category of categories; track category.id) {
          <button
            (click)="activeCategory = category.id"
            class="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all"
            [class]="activeCategory === category.id
              ? 'bg-primary dark:bg-white text-white dark:text-primary shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary dark:hover:border-white'"
          >
            <span class="material-symbols-outlined text-lg">{{ category.icon }}</span>
            {{ category.label }}
          </button>
        }
      </div>

      <!-- Featured Section -->
      <div class="mb-10">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-amber-500">auto_awesome</span>
          Featured Human Creators
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          @for (user of featuredUsers; track user.id) {
            <a
              [routerLink]="['/user', user.id]"
              class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-primary dark:hover:border-white transition-all group"
            >
              <div class="flex items-center gap-4 mb-4">
                <div
                  class="w-14 h-14 rounded-xl bg-cover bg-center border-2 border-slate-200 dark:border-slate-600 group-hover:border-primary dark:group-hover:border-white transition-colors"
                  [style.background-image]="'url(' + user.avatar + ')'"
                ></div>
                <div>
                  <div class="flex items-center gap-1">
                    <h3 class="font-bold text-slate-900 dark:text-white">{{ user.firstName }}</h3>
                    <span class="material-symbols-outlined text-emerald-500 text-lg filled">verified</span>
                  </div>
                  <p class="text-xs text-slate-500">{{ '@' + user.username }}</p>
                </div>
              </div>
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-1 text-slate-500">
                  <span class="material-symbols-outlined text-base">article</span>
                  {{ user.stats.postsCount }} posts
                </div>
                <div class="flex items-center gap-1 text-emerald-600">
                  <span class="material-symbols-outlined text-base">workspace_premium</span>
                  {{ user.trustScore }}%
                </div>
              </div>
            </a>
          }
        </div>
      </div>

      <!-- Trending Topics -->
      <div class="mb-10">
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-blue-500">trending_up</span>
          Trending Topics
        </h2>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
          @for (topic of trendingTopics; track topic.name; let i = $index) {
            <div class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
              <div class="flex items-center gap-4">
                <span class="text-lg font-bold text-slate-400 w-6">{{ i + 1 }}</span>
                <div>
                  <p class="font-bold text-slate-900 dark:text-white">#{{ topic.name }}</p>
                  <p class="text-xs text-slate-500">{{ topic.posts }} posts</p>
                </div>
              </div>
              <div class="flex items-center gap-1 text-xs font-medium" [class]="topic.change > 0 ? 'text-emerald-600' : 'text-red-500'">
                <span class="material-symbols-outlined text-sm">{{ topic.change > 0 ? 'trending_up' : 'trending_down' }}</span>
                {{ topic.change > 0 ? '+' : '' }}{{ topic.change }}%
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Recent Verified Posts -->
      <div>
        <h2 class="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span class="material-symbols-outlined text-emerald-500">verified</span>
          Recently Verified
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (post of recentPosts; track post.id) {
            <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
              @if (post.media && post.media[0]) {
                <div
                  class="h-40 bg-cover bg-center"
                  [style.background-image]="'url(' + post.media[0].url + ')'"
                ></div>
              }
              <div class="p-5">
                <div class="flex items-center gap-2 mb-3">
                  <div
                    class="w-8 h-8 rounded-lg bg-cover bg-center"
                    [style.background-image]="'url(' + post.author.avatar + ')'"
                  ></div>
                  <div>
                    <p class="text-sm font-bold text-slate-900 dark:text-white">{{ post.author.displayName }}</p>
                    <p class="text-xs text-slate-500">{{ getTimeAgo(post.createdAt) }}</p>
                  </div>
                </div>
                @if (post.title) {
                  <h3 class="font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">{{ post.title }}</h3>
                }
                <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{{ post.content }}</p>
                <div class="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div class="flex items-center gap-4 text-slate-500 text-xs">
                    <span class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm">verified</span>
                      {{ post.endorsements }}
                    </span>
                    <span class="flex items-center gap-1">
                      <span class="material-symbols-outlined text-sm">chat_bubble</span>
                      {{ post.comments }}
                    </span>
                  </div>
                  <span class="px-2 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium rounded">
                    {{ post.aiScore.toFixed(2) }}% AI
                  </span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class DiscoverComponent {
  dataService = inject(DataService);

  searchQuery = '';
  activeCategory = 'all';

  categories = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'tech', label: 'Technology', icon: 'computer' },
    { id: 'finance', label: 'Finance', icon: 'trending_up' },
    { id: 'art', label: 'Art & Design', icon: 'palette' },
    { id: 'science', label: 'Science', icon: 'science' },
    { id: 'photography', label: 'Photography', icon: 'camera_alt' },
  ];

  trendingTopics = [
    { name: 'HumanCreativity', posts: 2840, change: 15 },
    { name: 'RooCoinMarket', posts: 1925, change: 8 },
    { name: 'AIDetection', posts: 1542, change: -3 },
    { name: 'ContentVerification', posts: 1201, change: 22 },
    { name: 'TrustScore', posts: 987, change: 5 },
  ];

  get featuredUsers() {
    return this.dataService.trustLeaders().slice(0, 4);
  }

  get recentPosts() {
    return this.dataService.posts().slice(0, 6);
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
}

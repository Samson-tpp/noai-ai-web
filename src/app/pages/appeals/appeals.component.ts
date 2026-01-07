import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-appeals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Appeals Center</h1>
          <p class="text-slate-500 text-sm md:text-base">Manage disputes and verify human authorship.</p>
        </div>
        <button class="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <span class="material-symbols-outlined text-lg">history</span>
          Export Log
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <p class="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Total Appeals</p>
          <p class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{{ dataService.appeals().length }}</p>
          <div class="mt-2 flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <span class="material-symbols-outlined text-sm">trending_up</span>
            <span>+2 this week</span>
          </div>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <p class="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Success Rate</p>
          <p class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{{ getSuccessRate() }}%</p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
          <p class="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">RooCoin at Risk</p>
          <p class="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{{ getTotalAtRisk() }} ROO</p>
          @if (getPendingCount() > 0) {
            <div class="mt-2 flex items-center gap-1 text-xs text-red-600 font-medium">
              <span class="material-symbols-outlined text-sm">error</span>
              <span>Action required on {{ getPendingCount() }} case(s)</span>
            </div>
          }
        </div>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <!-- Appeals History -->
        <div class="xl:col-span-7 space-y-4">
          <h3 class="text-lg font-bold text-slate-900 dark:text-white">Recent History</h3>
          <div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Case ID</th>
                  <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                  <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                  <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                  <th class="px-5 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500 text-right">Outcome</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                @for (appeal of dataService.appeals(); track appeal.id) {
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                    <td class="px-5 py-4">
                      <span class="font-mono text-sm font-bold text-slate-900 dark:text-white">{{ appeal.caseId }}</span>
                    </td>
                    <td class="px-5 py-4">
                      <div class="text-sm text-slate-600 dark:text-slate-300">{{ formatDate(appeal.submittedAt) }}</div>
                      <div class="text-xs text-slate-400">{{ formatTime(appeal.submittedAt) }}</div>
                    </td>
                    <td class="px-5 py-4">
                      <div class="flex items-center gap-2">
                        <span class="material-symbols-outlined text-slate-400 text-lg">{{ getTypeIcon(appeal.postType) }}</span>
                        <span class="text-sm text-slate-600 dark:text-slate-300 capitalize">{{ appeal.postType }}</span>
                      </div>
                    </td>
                    <td class="px-5 py-4">
                      <span
                        class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border"
                        [class]="getStatusClass(appeal.status)"
                      >
                        <span class="size-1.5 rounded-full" [class]="getStatusDotClass(appeal.status)"></span>
                        {{ appeal.status | titlecase }}
                      </span>
                    </td>
                    <td class="px-5 py-4 text-right">
                      @if (appeal.outcome) {
                        @if (appeal.outcome.decision === 'approved') {
                          <div class="flex items-center justify-end gap-1 text-emerald-600">
                            <span class="text-sm font-bold">+{{ appeal.outcome.rooCoinResult }} ROO</span>
                            <span class="material-symbols-outlined text-base">verified</span>
                          </div>
                        } @else {
                          <div class="text-sm font-bold text-slate-500">Content Removed</div>
                          <div class="text-xs text-slate-400">{{ appeal.outcome.reason.substring(0, 20) }}...</div>
                        }
                      } @else {
                        <span class="text-sm text-amber-600 font-medium">Pending Review</span>
                      }
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Submit Appeal -->
        <div class="xl:col-span-5">
          <div class="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
            <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 rounded-t-2xl">
              <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-primary dark:text-white">gavel</span>
                Submit Appeal Evidence
              </h3>
            </div>
            <div class="p-6 space-y-6">
              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Case Reference</label>
                <select
                  [(ngModel)]="selectedCase"
                  class="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 pl-4 pr-10 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a flagged item...</option>
                  @for (appeal of getPendingAppeals(); track appeal.id) {
                    <option [value]="appeal.id">{{ appeal.caseId }} - {{ appeal.postType | titlecase }}</option>
                  }
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Defense Argument</label>
                <textarea
                  [(ngModel)]="defenseArgument"
                  class="w-full min-h-[120px] rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 p-4 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Describe your creation process, provide evidence of human authorship..."
                ></textarea>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-slate-700 dark:text-slate-300">Supporting Evidence</label>
                <div class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-primary dark:hover:border-white transition-colors cursor-pointer">
                  <span class="material-symbols-outlined text-3xl text-slate-400 mb-2">cloud_upload</span>
                  <p class="text-sm text-slate-500">Drag & drop files or click to browse</p>
                  <p class="text-xs text-slate-400 mt-1">Screenshots, drafts, or process recordings</p>
                </div>
              </div>

              <div class="flex gap-3 pt-2">
                <button class="flex-1 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors">
                  Save Draft
                </button>
                <button
                  (click)="submitAppeal()"
                  [disabled]="!selectedCase || !defenseArgument"
                  class="flex-1 rounded-xl bg-primary dark:bg-white px-4 py-3 text-sm font-bold text-white dark:text-primary hover:bg-primary/90 dark:hover:bg-slate-100 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Submit Appeal</span>
                  <span class="material-symbols-outlined text-lg">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppealsComponent {
  dataService = inject(DataService);
  toastService = inject(ToastService);

  selectedCase = '';
  defenseArgument = '';

  getSuccessRate(): number {
    const resolved = this.dataService.appeals().filter(a => a.status === 'approved' || a.status === 'rejected');
    if (resolved.length === 0) return 0;
    const approved = resolved.filter(a => a.status === 'approved').length;
    return Math.round((approved / resolved.length) * 100);
  }

  getTotalAtRisk(): number {
    return this.dataService.appeals()
      .filter(a => a.status === 'pending' || a.status === 'in_review')
      .reduce((sum, a) => sum + a.rooCoinAtRisk, 0);
  }

  getPendingCount(): number {
    return this.dataService.appeals().filter(a => a.status === 'pending').length;
  }

  getPendingAppeals() {
    return this.dataService.appeals().filter(a => a.status === 'pending');
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      image: 'image',
      text: 'article',
      article: 'description',
      video: 'videocam',
    };
    return icons[type] || 'article';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-700';
      case 'rejected':
        return 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700';
      case 'in_review':
        return 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700';
      default:
        return 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700';
    }
  }

  getStatusDotClass(status: string): string {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500';
      case 'rejected':
        return 'bg-red-500';
      case 'in_review':
        return 'bg-blue-500';
      default:
        return 'bg-amber-500';
    }
  }

  submitAppeal(): void {
    if (!this.selectedCase || !this.defenseArgument) return;

    this.toastService.success('Appeal submitted!', 'Your appeal has been submitted for review.');
    this.selectedCase = '';
    this.defenseArgument = '';
  }
}

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col gap-1 mb-6">
        <h1 class="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Creation Studio</h1>
        <p class="text-slate-500 text-sm">Compose high-trust content for the NOAI network.</p>
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <!-- Editor Section -->
        <section class="xl:col-span-7 space-y-6">
          <!-- Editor Card -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <!-- Title Input -->
            <div class="p-5 border-b border-slate-200 dark:border-slate-700">
              <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Title (Optional)</label>
              <input
                type="text"
                [(ngModel)]="title"
                class="w-full text-xl font-bold text-slate-900 dark:text-white bg-transparent border-none p-0 focus:ring-0 placeholder-slate-300"
                placeholder="Enter headline..."
              >
            </div>

            <!-- Toolbar -->
            <div class="px-4 py-3 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <div class="flex items-center bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm">
                <button
                  (click)="insertFormat('bold')"
                  class="p-2 text-slate-500 hover:text-primary active:bg-slate-100 dark:active:bg-slate-600 transition-colors rounded-l-lg"
                  title="Bold"
                >
                  <span class="material-symbols-outlined text-xl">format_bold</span>
                </button>
                <button
                  (click)="insertFormat('italic')"
                  class="p-2 text-slate-500 hover:text-primary active:bg-slate-100 dark:active:bg-slate-600 transition-colors"
                  title="Italic"
                >
                  <span class="material-symbols-outlined text-xl">format_italic</span>
                </button>
                <button
                  (click)="insertFormat('list')"
                  class="p-2 text-slate-500 hover:text-primary active:bg-slate-100 dark:active:bg-slate-600 transition-colors rounded-r-lg"
                  title="List"
                >
                  <span class="material-symbols-outlined text-xl">format_list_bulleted</span>
                </button>
              </div>

              <button class="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary shadow-sm ml-auto">
                <span class="material-symbols-outlined text-lg">add_photo_alternate</span>
                <span class="hidden sm:inline">Add Media</span>
              </button>
            </div>

            <!-- Content Editor -->
            <div class="p-5 min-h-[300px]">
              <textarea
                [(ngModel)]="content"
                class="w-full h-80 resize-none border-none focus:ring-0 text-base text-slate-700 dark:text-slate-300 bg-transparent p-0 font-mono"
                placeholder="Start writing your content here...

You can use markdown formatting:
- **bold** for emphasis
- _italic_ for quotes
- Lists with bullet points

Share your authentic human insights with the NOAI community."
              ></textarea>
            </div>
          </div>

          <!-- Options Row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Content Authenticity -->
            <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-amber-500 mt-0.5 text-2xl">verified_user</span>
                <div>
                  <h3 class="text-sm font-bold text-slate-900 dark:text-white">Content Authenticity</h3>
                  <p class="text-xs text-slate-500 mt-1 mb-4">AI-generated content is strictly prohibited on NOAI.</p>
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      [(ngModel)]="certifyHuman"
                      class="rounded border-slate-300 text-primary focus:ring-primary h-5 w-5"
                    >
                    <span class="text-sm font-medium text-slate-700 dark:text-slate-300">I certify this content is human-generated.</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Cost & Actions -->
            <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
              <div class="flex justify-between items-center mb-4">
                <span class="text-xs font-semibold text-slate-500 uppercase">Estimated Cost</span>
                <span class="text-xl font-bold text-slate-900 dark:text-white tabular-nums">
                  {{ estimatedCost }} <span class="text-sm font-normal text-slate-400">ROO</span>
                </span>
              </div>
              <div class="text-xs text-slate-400 mb-4">
                Your balance: {{ dataService.currentUser()?.rooCoinBalance?.toLocaleString() }} ROO
              </div>
              <div class="flex gap-3">
                <button
                  (click)="saveDraft()"
                  class="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Save Draft
                </button>
                <button
                  (click)="publish()"
                  [disabled]="!canPublish()"
                  class="flex-1 px-4 py-2.5 bg-primary hover:bg-primary/90 dark:bg-white dark:text-primary dark:hover:bg-slate-100 text-white rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span>Publish</span>
                  <span class="material-symbols-outlined text-lg">send</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Preview Section -->
        <section class="xl:col-span-5">
          <div class="sticky top-24 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">visibility</span>
                Live Preview
              </h3>
            </div>

            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm overflow-hidden">
              <!-- Author Header -->
              <div class="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div
                    class="size-11 rounded-xl bg-cover bg-center border border-slate-200 dark:border-slate-600"
                    [style.background-image]="'url(' + dataService.currentUser()?.avatar + ')'"
                  ></div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-bold text-slate-900 dark:text-white">
                        {{ dataService.currentUser()?.firstName }} {{ dataService.currentUser()?.lastName }}
                      </span>
                      <span class="material-symbols-outlined text-blue-500 text-base filled">verified</span>
                    </div>
                    <span class="text-xs text-slate-500">Just now</span>
                  </div>
                </div>
                <span class="material-symbols-outlined text-slate-400">more_horiz</span>
              </div>

              <!-- Preview Content -->
              <div class="p-5">
                @if (title) {
                  <h4 class="text-lg font-bold text-slate-900 dark:text-white mb-3 leading-tight">{{ title }}</h4>
                }

                <div class="prose prose-sm prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 mb-4 whitespace-pre-line">
                  {{ content || 'Your content will appear here...' }}
                </div>

                <!-- Tags -->
                @if (tags.length > 0) {
                  <div class="flex flex-wrap gap-2 mt-4">
                    @for (tag of tags; track tag) {
                      <span class="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-lg">
                        #{{ tag }}
                      </span>
                    }
                  </div>
                }
              </div>

              <!-- Verification Badge Preview -->
              @if (certifyHuman) {
                <div class="px-5 py-3 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-200 dark:border-emerald-700 flex items-center gap-2">
                  <span class="material-symbols-outlined text-emerald-500 text-lg">fingerprint</span>
                  <span class="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Human Verified Content</span>
                </div>
              }
            </div>

            <!-- Tips Card -->
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800">
              <h4 class="text-sm font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                <span class="material-symbols-outlined text-lg">lightbulb</span>
                Tips for Approval
              </h4>
              <ul class="text-xs text-blue-700 dark:text-blue-400 space-y-2">
                <li class="flex items-start gap-2">
                  <span class="material-symbols-outlined text-sm mt-0.5">check</span>
                  Write naturally with your own voice and style
                </li>
                <li class="flex items-start gap-2">
                  <span class="material-symbols-outlined text-sm mt-0.5">check</span>
                  Include personal insights or experiences
                </li>
                <li class="flex items-start gap-2">
                  <span class="material-symbols-outlined text-sm mt-0.5">check</span>
                  Avoid overly formal or templated language
                </li>
                <li class="flex items-start gap-2">
                  <span class="material-symbols-outlined text-sm mt-0.5">check</span>
                  Original photos increase trust score
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  `
})
export class CreateComponent {
  dataService = inject(DataService);
  toastService = inject(ToastService);
  router = inject(Router);

  title = '';
  content = '';
  certifyHuman = false;
  tags: string[] = [];
  estimatedCost = 50;

  insertFormat(type: string): void {
    switch (type) {
      case 'bold':
        this.content += '**bold text**';
        break;
      case 'italic':
        this.content += '_italic text_';
        break;
      case 'list':
        this.content += '\n- Item 1\n- Item 2\n- Item 3';
        break;
    }
  }

  canPublish(): boolean {
    return this.content.trim().length > 10 && this.certifyHuman;
  }

  saveDraft(): void {
    this.toastService.info('Draft saved', 'Your content has been saved as a draft.');
  }

  publish(): void {
    if (!this.canPublish()) return;

    this.dataService.addPost({
      title: this.title || undefined,
      content: this.content,
      tags: this.tags
    });

    this.toastService.success('Post published!', 'Your content is now being verified by our AI detection system.');
    this.router.navigate(['/feed']);
  }
}

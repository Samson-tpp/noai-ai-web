import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Help & Support</h1>
      <p class="text-slate-500 mb-8">Find answers to common questions or contact our support team.</p>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Quick Links -->
        <div class="bg-gradient-to-br from-primary to-slate-800 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6 text-white">
          <span class="material-symbols-outlined text-3xl mb-4">support_agent</span>
          <h3 class="font-bold text-lg mb-2">24/7 Support</h3>
          <p class="text-sm text-white/80 mb-4">Our team is here to help you with any questions or issues.</p>
          <button class="w-full py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-medium transition-colors">
            Start Live Chat
          </button>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <span class="material-symbols-outlined text-3xl text-amber-500 mb-4">menu_book</span>
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">Documentation</h3>
          <p class="text-sm text-slate-500 mb-4">Comprehensive guides and tutorials for all features.</p>
          <button class="w-full py-2.5 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors text-slate-700 dark:text-slate-300">
            View Docs
          </button>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <span class="material-symbols-outlined text-3xl text-emerald-500 mb-4">forum</span>
          <h3 class="font-bold text-lg text-slate-900 dark:text-white mb-2">Community</h3>
          <p class="text-sm text-slate-500 mb-4">Join discussions and connect with other users.</p>
          <button class="w-full py-2.5 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-sm font-medium transition-colors text-slate-700 dark:text-slate-300">
            Join Forum
          </button>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-8">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <h2 class="font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
        </div>
        <div class="divide-y divide-slate-100 dark:divide-slate-700">
          @for (faq of faqs; track faq.question) {
            <div class="p-6">
              <button
                (click)="faq.open = !faq.open"
                class="flex items-center justify-between w-full text-left"
              >
                <span class="font-medium text-slate-900 dark:text-white">{{ faq.question }}</span>
                <span class="material-symbols-outlined text-slate-400 transition-transform" [class.rotate-180]="faq.open">
                  expand_more
                </span>
              </button>
              @if (faq.open) {
                <p class="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{{ faq.answer }}</p>
              }
            </div>
          }
        </div>
      </div>

      <!-- Contact Form -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <h2 class="font-bold text-slate-900 dark:text-white">Contact Support</h2>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
              <select
                [(ngModel)]="contactSubject"
                class="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select a topic...</option>
                <option value="account">Account Issues</option>
                <option value="content">Content Moderation</option>
                <option value="wallet">RooCoin & Wallet</option>
                <option value="technical">Technical Support</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priority</label>
              <select
                [(ngModel)]="contactPriority"
                class="w-full h-11 px-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
            <textarea
              [(ngModel)]="contactMessage"
              class="w-full h-32 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
              placeholder="Describe your issue or question..."
            ></textarea>
          </div>
          <button
            (click)="submitTicket()"
            [disabled]="!contactSubject || !contactMessage"
            class="px-6 py-3 bg-primary dark:bg-white text-white dark:text-primary font-bold rounded-xl hover:bg-primary/90 dark:hover:bg-slate-100 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Ticket
          </button>
        </div>
      </div>

      <!-- Legal Links -->
      <div class="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-500">
        <a href="#" class="hover:text-primary dark:hover:text-white transition-colors">Terms of Service</a>
        <a href="#" class="hover:text-primary dark:hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" class="hover:text-primary dark:hover:text-white transition-colors">No-AI Policy</a>
        <a href="#" class="hover:text-primary dark:hover:text-white transition-colors">Cookie Policy</a>
      </div>
    </div>
  `
})
export class SupportComponent {
  toastService = inject(ToastService);

  contactSubject = '';
  contactPriority = 'medium';
  contactMessage = '';

  faqs = [
    {
      question: 'How does NOAI detect AI-generated content?',
      answer: 'NOAI uses a combination of advanced machine learning models, keystroke dynamics analysis, behavioral patterns, and semantic analysis to detect AI-generated content with over 99% accuracy. Our system continuously learns and improves to stay ahead of new AI generation techniques.',
      open: false
    },
    {
      question: 'What is RooCoin and how does it work?',
      answer: 'RooCoin is an Ethereum-based token used as credits within the NOAI platform. You can earn RooCoin by creating verified human content, participating in moderation, and staking. RooCoin can be used to post content, appeal decisions, and access premium features.',
      open: false
    },
    {
      question: 'How do I appeal a content moderation decision?',
      answer: 'If your content is flagged as AI-generated, you can submit an appeal through the Appeals Center. Provide evidence of your creation process, such as drafts, timestamps, or screen recordings. Our human moderators will review your case within 24-48 hours.',
      open: false
    },
    {
      question: 'What are the benefits of staking RooCoin?',
      answer: 'Staking RooCoin provides multiple benefits: earn up to 8% APY on your staked tokens, gain priority visibility for your content in feeds, receive a reputation score boost, and unlock premium platform features.',
      open: false
    },
    {
      question: 'Is my wallet secure?',
      answer: 'Yes, NOAI uses a custodial wallet system with bank-grade security. Your assets are protected by multi-signature authorization, cold storage, and regular security audits. We also support two-factor authentication for additional account protection.',
      open: false
    }
  ];

  submitTicket(): void {
    if (!this.contactSubject || !this.contactMessage) return;

    this.toastService.success('Ticket submitted!', 'We\'ll get back to you within 24 hours.');
    this.contactSubject = '';
    this.contactMessage = '';
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div class="flex flex-col gap-1">
          <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Wallet Overview</h1>
          <p class="text-slate-500 text-sm md:text-base">Manage your RooCoin assets and track yield performance.</p>
        </div>
        <div class="flex items-center gap-2 text-sm text-slate-500 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Network Status: Online
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <!-- Balance Card -->
        <div class="lg:col-span-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-5 md:p-6 lg:p-8 border border-amber-200 dark:border-amber-700 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <span class="material-symbols-outlined text-[120px]">account_balance_wallet</span>
          </div>
          <div class="relative z-10">
            <p class="text-amber-700 dark:text-amber-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Balance</p>
            <div class="flex items-baseline gap-3 flex-wrap">
              <h2 class="text-4xl md:text-5xl font-bold text-amber-800 dark:text-amber-300 tracking-tight font-mono">
                {{ wallet().totalBalance.toLocaleString('en-US', {minimumFractionDigits: 2}) }}
              </h2>
              <span class="text-2xl font-medium text-amber-600 dark:text-amber-500">ROO</span>
            </div>
            <p class="text-amber-600 dark:text-amber-500 text-lg font-medium mt-2">
              ≈ {{ formatUsd(wallet().usdValue) }} USD
            </p>

            <div class="flex flex-col sm:flex-row gap-3 mt-6 md:mt-8">
              <a routerLink="/staking" class="flex items-center justify-center gap-2 h-11 md:h-12 px-5 md:px-6 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-xl transition-all shadow-md">
                <span class="material-symbols-outlined text-lg md:text-xl">savings</span>
                Earn Yield
              </a>
              <button class="flex items-center justify-center gap-2 h-11 md:h-12 px-5 md:px-6 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-slate-700 text-sm font-bold rounded-xl transition-all cursor-pointer">
                <span class="material-symbols-outlined text-lg md:text-xl">payments</span>
                Spend
              </button>
            </div>
          </div>
        </div>

        <!-- Mini Stats -->
        <div class="flex flex-col gap-4">
          <div class="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider">Current APY</p>
              <span class="material-symbols-outlined text-emerald-500 text-xl">trending_up</span>
            </div>
            <div class="flex items-end gap-2">
              <p class="text-3xl font-bold text-slate-900 dark:text-white font-mono">{{ wallet().currentAPY }}%</p>
              <p class="text-emerald-600 text-sm font-medium mb-1 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">+0.05%</p>
            </div>
          </div>
          <div class="flex-1 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div class="flex items-center justify-between mb-3">
              <p class="text-slate-500 text-xs font-semibold uppercase tracking-wider">Total Earned</p>
              <span class="material-symbols-outlined text-amber-500 text-xl">monetization_on</span>
            </div>
            <div class="flex items-end gap-2">
              <p class="text-3xl font-bold text-slate-900 dark:text-white font-mono">{{ wallet().totalEarned.toLocaleString() }}</p>
              <span class="text-slate-500 text-sm mb-1">ROO</span>
            </div>
            <p class="text-emerald-600 text-xs font-medium mt-1">+{{ wallet().monthlyEarnings }} this month</p>
          </div>
        </div>
      </div>

      <!-- Balance Breakdown -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <p class="text-slate-500 text-xs font-semibold uppercase mb-2">Available</p>
          <p class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {{ wallet().availableBalance.toLocaleString() }} <span class="text-sm text-slate-400">ROO</span>
          </p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <p class="text-slate-500 text-xs font-semibold uppercase mb-2">Staked</p>
          <p class="text-xl md:text-2xl font-bold text-slate-900 dark:text-white font-mono">
            {{ wallet().stakedBalance.toLocaleString() }} <span class="text-sm text-slate-400">ROO</span>
          </p>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-4 md:p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <p class="text-slate-500 text-xs font-semibold uppercase mb-2">Pending Rewards</p>
          <p class="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            +{{ wallet().pendingRewards.toLocaleString() }} <span class="text-sm text-slate-400">ROO</span>
          </p>
        </div>
      </div>

      <!-- Transactions -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
          <a href="#" class="text-sm font-medium text-primary dark:text-white hover:underline flex items-center gap-1">
            View All <span class="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  <th class="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction</th>
                  <th class="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th class="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                  <th class="py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-700">
                @for (tx of dataService.transactions(); track tx.id) {
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td class="py-4 px-6">
                      <div class="flex items-center gap-3">
                        <div class="p-2.5 rounded-xl" [class]="getTransactionIconClass(tx.type)">
                          <span class="material-symbols-outlined text-lg">{{ getTransactionIcon(tx.type) }}</span>
                        </div>
                        <div>
                          <p class="text-sm font-semibold text-slate-900 dark:text-white">{{ tx.description }}</p>
                          <p class="text-xs text-slate-500">{{ tx.reference }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-6">
                      <p class="text-sm text-slate-600 dark:text-slate-300">{{ formatDate(tx.createdAt) }}</p>
                    </td>
                    <td class="py-4 px-6 text-right">
                      <p class="text-sm font-bold" [class]="tx.amount >= 0 ? 'text-emerald-600' : 'text-slate-900 dark:text-white'">
                        {{ tx.amount >= 0 ? '+' : '' }}{{ tx.amount.toLocaleString() }} ROO
                      </p>
                    </td>
                    <td class="py-4 px-6 text-right">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" [class]="getStatusClass(tx.status)">
                        {{ tx.status | titlecase }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WalletComponent {
  dataService = inject(DataService);

  wallet = this.dataService.walletOverview;

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatUsd(value: number): string {
    return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  getTransactionIcon(type: string): string {
    const icons: Record<string, string> = {
      staking_reward: 'savings',
      post_reward: 'verified',
      moderation_reward: 'gavel',
      post_cost: 'edit_square',
      appeal_cost: 'gavel',
      stake: 'lock',
      unstake: 'lock_open',
      transfer_in: 'arrow_downward',
      transfer_out: 'arrow_upward',
      bonus: 'stars',
    };
    return icons[type] || 'receipt';
  }

  getTransactionIconClass(type: string): string {
    if (['staking_reward', 'post_reward', 'moderation_reward', 'bonus', 'transfer_in'].includes(type)) {
      return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400';
    }
    if (['post_cost', 'appeal_cost', 'transfer_out'].includes(type)) {
      return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
    }
    return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300';
    }
  }
}

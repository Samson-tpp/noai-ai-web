import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-staking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Staking & Reputation</h1>
          <p class="text-slate-500 mt-1 max-w-2xl text-sm md:text-base">Lock your RooCoin to validate your humanity, earn yields, and gain visibility priority.</p>
        </div>
        <div class="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl shadow-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Network: Operational
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 space-y-6">
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Total Locked Value</p>
              <p class="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {{ staking().totalLocked.toLocaleString() }} <span class="text-amber-500 text-base">ROO</span>
              </p>
              <div class="flex items-center gap-1 text-xs font-medium text-emerald-600 mt-2">
                <span class="material-symbols-outlined text-sm">trending_up</span>
                <span>+250 ROO (Last 30d)</span>
              </div>
            </div>
            <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Current APY</p>
              <p class="text-2xl font-bold text-slate-900 dark:text-white font-mono">{{ staking().currentAPY }}%</p>
              <p class="text-xs text-slate-400 mt-2">Variable rate based on network trust</p>
            </div>
            <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <p class="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Reputation Score</p>
              <p class="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {{ dataService.currentUser()?.stats?.reputationScore }} <span class="text-sm font-normal text-slate-400">/ 1000</span>
              </p>
              <div class="flex items-center gap-1 text-xs font-medium text-amber-600 mt-2">
                <span class="material-symbols-outlined text-sm filled">stars</span>
                <span>High Trust Level</span>
              </div>
            </div>
          </div>

          <!-- Staking Manager -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <div class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 px-6 py-4 flex items-center justify-between">
              <h3 class="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span class="material-symbols-outlined text-slate-400">tune</span>
                Staking Manager
              </h3>
            </div>
            <div class="p-6 md:p-8">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <!-- Amount Input -->
                <div class="flex flex-col gap-3">
                  <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Amount to Lock</label>
                  <div class="relative">
                    <input
                      type="text"
                      [(ngModel)]="stakeAmount"
                      class="w-full h-14 pl-4 pr-20 text-xl font-mono font-medium text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white dark:bg-slate-700 transition-all"
                      placeholder="0.00"
                    >
                    <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <button
                        (click)="setMaxAmount()"
                        class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                      >
                        MAX
                      </button>
                      <span class="text-slate-400 text-sm font-medium">ROO</span>
                    </div>
                  </div>
                  <p class="text-xs text-slate-500">Available: {{ wallet().availableBalance.toLocaleString() }} ROO</p>
                </div>

                <!-- Lock Period -->
                <div class="flex flex-col gap-3">
                  <div class="flex justify-between items-center">
                    <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Lock-up Period</label>
                    <span class="text-amber-600 dark:text-amber-400 font-bold">{{ lockPeriod() }} Days</span>
                  </div>
                  <div class="h-14 flex items-center px-2">
                    <input
                      type="range"
                      min="30"
                      max="365"
                      [value]="lockPeriod()"
                      (input)="onLockPeriodChange($event)"
                      class="w-full h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    >
                  </div>
                  <div class="flex justify-between text-xs text-slate-500">
                    <span>30 days</span>
                    <span>365 days</span>
                  </div>
                </div>
              </div>

              <!-- Projected Earnings -->
              <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 mb-6">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-slate-600 dark:text-slate-400">Projected Earnings ({{ lockPeriod() }} days)</span>
                  <span class="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    +{{ calculateProjectedEarnings().toFixed(2) }} ROO
                  </span>
                </div>
              </div>

              <button
                (click)="confirmStaking()"
                [disabled]="!stakeAmount"
                class="w-full h-14 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="material-symbols-outlined">lock</span>
                Confirm Staking
              </button>
            </div>
          </div>

          <!-- Benefits -->
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-200 dark:border-amber-700">
            <h4 class="font-bold text-amber-800 dark:text-amber-300 mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined">stars</span>
              Staking Benefits
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-amber-600 text-xl">trending_up</span>
                <div>
                  <p class="text-sm font-bold text-amber-800 dark:text-amber-300">Earn Yield</p>
                  <p class="text-xs text-amber-700 dark:text-amber-400">Up to 8% APY on staked tokens</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-amber-600 text-xl">visibility</span>
                <div>
                  <p class="text-sm font-bold text-amber-800 dark:text-amber-300">Priority Visibility</p>
                  <p class="text-xs text-amber-700 dark:text-amber-400">Higher ranking in feeds</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <span class="material-symbols-outlined text-amber-600 text-xl">workspace_premium</span>
                <div>
                  <p class="text-sm font-bold text-amber-800 dark:text-amber-300">Trust Boost</p>
                  <p class="text-xs text-amber-700 dark:text-amber-400">+{{ staking().reputationBonus }} reputation points</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <div class="lg:col-span-4 space-y-6">
          <!-- Profile Card -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 flex flex-col items-center text-center">
            <div class="relative w-24 h-24 rounded-full border-4 border-amber-200 dark:border-amber-700 flex items-center justify-center mb-4 p-1">
              <div
                class="w-full h-full rounded-full bg-cover bg-center overflow-hidden"
                [style.background-image]="'url(' + dataService.currentUser()?.avatar + ')'"
              ></div>
              <div class="absolute bottom-0 right-0 bg-amber-500 text-white p-1.5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm">
                <span class="material-symbols-outlined text-sm font-bold">check</span>
              </div>
            </div>
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Verified Human</h3>
            <p class="text-sm text-slate-500 mt-1 mb-4">Level 3 Clearance</p>

            <!-- Progress Bar -->
            <div class="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 mb-2 overflow-hidden">
              <div class="bg-amber-500 h-2.5 rounded-full" [style.width.%]="(dataService.currentUser()?.stats?.reputationScore || 0) / 10"></div>
            </div>
            <div class="w-full flex justify-between text-xs text-slate-400 font-medium mb-6">
              <span>{{ dataService.currentUser()?.stats?.reputationScore }} Pts</span>
              <span>Next Level: 1000</span>
            </div>

            <div class="w-full space-y-3 text-left">
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500">Currently Staked</span>
                <span class="font-bold text-slate-900 dark:text-white font-mono">{{ staking().totalLocked.toLocaleString() }} ROO</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500">Lock Period</span>
                <span class="font-bold text-slate-900 dark:text-white">{{ staking().lockPeriodDays }} days</span>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-slate-500">Unlock Date</span>
                <span class="font-bold text-slate-900 dark:text-white">{{ formatDate(staking().unlockDate) }}</span>
              </div>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-5">
            <h4 class="font-bold text-slate-900 dark:text-white mb-4">Network Stats</h4>
            <div class="space-y-3">
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Total Staked (Network)</span>
                <span class="font-bold text-slate-900 dark:text-white">42.5M ROO</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Active Stakers</span>
                <span class="font-bold text-slate-900 dark:text-white">12,847</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">Avg. Lock Period</span>
                <span class="font-bold text-slate-900 dark:text-white">127 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class StakingComponent {
  dataService = inject(DataService);
  toastService = inject(ToastService);

  wallet = this.dataService.walletOverview;
  staking = this.dataService.stakingInfo;

  stakeAmount = '';
  lockPeriod = signal(90);

  onLockPeriodChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.lockPeriod.set(parseInt(value));
  }

  setMaxAmount(): void {
    this.stakeAmount = this.wallet().availableBalance.toString();
  }

  calculateProjectedEarnings(): number {
    const amount = parseFloat(this.stakeAmount) || 0;
    const apy = this.staking().currentAPY / 100;
    const days = this.lockPeriod();
    return amount * apy * (days / 365);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  confirmStaking(): void {
    if (!this.stakeAmount) return;
    this.toastService.success('Staking confirmed!', `${this.stakeAmount} ROO locked for ${this.lockPeriod()} days.`);
    this.stakeAmount = '';
  }
}

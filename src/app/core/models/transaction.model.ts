export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: 'ROO' | 'USD';
  status: 'pending' | 'completed' | 'failed';
  description: string;
  reference?: string;
  createdAt: Date;
  completedAt?: Date;
}

export type TransactionType =
  | 'staking_reward'
  | 'post_reward'
  | 'moderation_reward'
  | 'post_cost'
  | 'appeal_cost'
  | 'stake'
  | 'unstake'
  | 'transfer_in'
  | 'transfer_out'
  | 'bonus';

export interface WalletOverview {
  totalBalance: number;
  availableBalance: number;
  stakedBalance: number;
  pendingRewards: number;
  usdValue: number;
  currentAPY: number;
  totalEarned: number;
  monthlyEarnings: number;
}

export interface StakingInfo {
  totalLocked: number;
  lockPeriodDays: number;
  unlockDate?: Date;
  currentAPY: number;
  projectedEarnings: number;
  reputationBonus: number;
}

export interface RooCoinMarket {
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
}

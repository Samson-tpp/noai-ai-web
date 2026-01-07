export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  bio?: string;
  joinDate: Date;
  isVerified: boolean;
  trustScore: number;
  badges: Badge[];
  stats: UserStats;
  rooCoinBalance: number;
  stakedAmount: number;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface UserStats {
  postsCount: number;
  endorsementsReceived: number;
  endorsementsGiven: number;
  humanVerifiedPosts: number;
  aiRejectedPosts: number;
  appealSuccessRate: number;
  reputationScore: number;
}

export interface AuthCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  icon?: string;
  iconColor?: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export type NotificationType =
  | 'post_verified'
  | 'post_flagged'
  | 'comment_reply'
  | 'endorsement'
  | 'follow'
  | 'mention'
  | 'moderation_alert'
  | 'appeal_update'
  | 'staking_reward'
  | 'system'
  | 'roocoin';

export interface Appeal {
  id: string;
  caseId: string;
  postId: string;
  postType: 'image' | 'text' | 'article' | 'video';
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  submittedAt: Date;
  resolvedAt?: Date;
  aiScore: number;
  defenseArgument?: string;
  evidence?: string[];
  outcome?: AppealOutcome;
  rooCoinAtRisk: number;
}

export interface AppealOutcome {
  decision: 'approved' | 'rejected';
  reason: string;
  rooCoinResult: number;
  moderatorNotes?: string;
}

export interface ModerationCase {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  aiScore: number;
  flaggedAt: Date;
  status: 'pending' | 'under_review' | 'resolved';
  violationType?: string;
  reviewerNotes?: string;
}

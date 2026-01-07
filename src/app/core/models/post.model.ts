export interface Post {
  id: string;
  author: PostAuthor;
  content: string;
  title?: string;
  media?: PostMedia[];
  createdAt: Date;
  updatedAt?: Date;
  aiScore: number;
  aiScoreStatus: 'pass' | 'review' | 'flagged';
  verificationMethod?: string;
  sessionId?: string;
  endorsements: number;
  comments: number;
  reposts: number;
  isEndorsed?: boolean;
  isReposted?: boolean;
  tags?: string[];
  status: 'published' | 'draft' | 'under_review' | 'rejected' | 'appealed';
}

export interface PostAuthor {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isVerified: boolean;
  trustScore?: number;
}

export interface PostMedia {
  id: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnail?: string;
  caption?: string;
  metadata?: MediaMetadata;
}

export interface MediaMetadata {
  device?: string;
  timestamp?: Date;
  isVerified: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: PostAuthor;
  content: string;
  createdAt: Date;
  likes: number;
  replies?: Comment[];
  aiScore?: number;
}

export interface CreatePostData {
  title?: string;
  content: string;
  media?: File[];
  tags?: string[];
  isDraft?: boolean;
}

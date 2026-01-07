import { Injectable, signal, computed } from '@angular/core';
import { User, Badge, UserStats } from '../models/user.model';
import { Post, PostAuthor, Comment } from '../models/post.model';
import { Transaction, WalletOverview, StakingInfo, RooCoinMarket } from '../models/transaction.model';
import { Notification, Appeal, ModerationCase } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // Demo Users
  private readonly demoUsers: User[] = [
    {
      id: 'user-001',
      email: 'alex.morgan@noai.io',
      firstName: 'Alex',
      lastName: 'Morgan',
      username: 'alex_morgan',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      bio: 'Tech enthusiast, blockchain advocate, and human content creator. Building the future of authentic social media.',
      joinDate: new Date('2023-06-15'),
      isVerified: true,
      trustScore: 98,
      rooCoinBalance: 12450.50,
      stakedAmount: 5000,
      badges: [
        { id: 'b1', name: 'Verified Human', icon: 'verified_user', color: 'blue', description: 'Identity verified through multiple checks' },
        { id: 'b2', name: 'Top Contributor', icon: 'stars', color: 'purple', description: 'Top 1% of content creators' },
        { id: 'b3', name: 'Early Adopter', icon: 'rocket_launch', color: 'orange', description: 'Joined during beta phase' },
      ],
      stats: {
        postsCount: 247,
        endorsementsReceived: 1842,
        endorsementsGiven: 523,
        humanVerifiedPosts: 245,
        aiRejectedPosts: 2,
        appealSuccessRate: 100,
        reputationScore: 850,
      }
    },
    {
      id: 'user-002',
      email: 'sarah.jenkins@email.com',
      firstName: 'Sarah',
      lastName: 'Jenkins',
      username: 'sarah_tech',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
      bio: 'Software engineer and AI ethics researcher. Advocating for human creativity.',
      joinDate: new Date('2023-08-20'),
      isVerified: true,
      trustScore: 96,
      rooCoinBalance: 8320.00,
      stakedAmount: 3000,
      badges: [
        { id: 'b1', name: 'Verified Human', icon: 'verified_user', color: 'blue', description: 'Identity verified' },
        { id: 'b4', name: 'Tech Expert', icon: 'code', color: 'green', description: 'Recognized technology contributor' },
      ],
      stats: {
        postsCount: 189,
        endorsementsReceived: 1456,
        endorsementsGiven: 892,
        humanVerifiedPosts: 187,
        aiRejectedPosts: 2,
        appealSuccessRate: 50,
        reputationScore: 780,
      }
    },
    {
      id: 'user-003',
      email: 'david.chen@email.com',
      firstName: 'David',
      lastName: 'Chen',
      username: 'dchen_econ',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      bio: 'Economist and market analyst. Providing authentic insights on RooCoin economy.',
      joinDate: new Date('2023-07-10'),
      isVerified: true,
      trustScore: 99,
      rooCoinBalance: 15780.25,
      stakedAmount: 8000,
      badges: [
        { id: 'b1', name: 'Verified Human', icon: 'verified_user', color: 'blue', description: 'Identity verified' },
        { id: 'b5', name: 'Market Expert', icon: 'trending_up', color: 'emerald', description: 'Financial analysis expert' },
      ],
      stats: {
        postsCount: 312,
        endorsementsReceived: 2891,
        endorsementsGiven: 1204,
        humanVerifiedPosts: 312,
        aiRejectedPosts: 0,
        appealSuccessRate: 100,
        reputationScore: 920,
      }
    },
    {
      id: 'user-004',
      email: 'elena.code@email.com',
      firstName: 'Elena',
      lastName: 'Rodriguez',
      username: 'elena_code',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      bio: 'Full-stack developer and open-source contributor.',
      joinDate: new Date('2023-05-01'),
      isVerified: true,
      trustScore: 99.9,
      rooCoinBalance: 24500.00,
      stakedAmount: 12000,
      badges: [
        { id: 'b1', name: 'Verified Human', icon: 'verified_user', color: 'blue', description: 'Identity verified' },
        { id: 'b6', name: 'Trust Leader', icon: 'workspace_premium', color: 'gold', description: 'Highest trust score' },
      ],
      stats: {
        postsCount: 456,
        endorsementsReceived: 4521,
        endorsementsGiven: 2341,
        humanVerifiedPosts: 456,
        aiRejectedPosts: 0,
        appealSuccessRate: 100,
        reputationScore: 990,
      }
    }
  ];

  // Demo Posts
  private readonly demoPosts: Post[] = [
    {
      id: 'post-001',
      author: this.getAuthorFromUser(this.demoUsers[1]),
      title: 'Deep Dive: Rendering Engine Performance Analysis',
      content: `Just finished a deep dive into the new rendering engine performance metrics. The specific artifacting patterns we're seeing in the shadows suggest manual shading techniques rather than generative interpretation.\n\nAttached the raw output analysis below. The data integrity holds up under spectral analysis. This is exactly the kind of authentic human creativity we need more of in the tech space.`,
      media: [
        {
          id: 'm1',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
          caption: 'Performance Analysis Chart',
          metadata: { device: 'Sony A7III', isVerified: true }
        }
      ],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      aiScore: 0.02,
      aiScoreStatus: 'pass',
      verificationMethod: 'Keystroke Dynamics',
      sessionId: '8F2A...99C',
      endorsements: 24,
      comments: 8,
      reposts: 5,
      tags: ['technology', 'performance', 'analysis'],
      status: 'published'
    },
    {
      id: 'post-002',
      author: this.getAuthorFromUser(this.demoUsers[2]),
      content: `Market volatility in the RooCoin exchange is stabilizing. The initial influx of automated trading bots has been curbed by the new Proof-of-Humanity (PoH) protocols implemented last week.\n\nWe are seeing a 15% increase in manual, verified transactions. This is a huge win for organic economic growth on the platform.`,
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      aiScore: 1.2,
      aiScoreStatus: 'pass',
      endorsements: 142,
      comments: 31,
      reposts: 28,
      tags: ['roocoin', 'market', 'economy'],
      status: 'published'
    },
    {
      id: 'post-003',
      author: this.getAuthorFromUser(this.demoUsers[3]),
      title: 'The Future of Human Authentication',
      content: `After months of research, I'm excited to share our findings on multi-factor human authentication systems. The combination of keystroke dynamics, behavioral analysis, and semantic pattern recognition creates a robust verification layer.\n\nKey findings:\n- 99.7% accuracy in detecting AI-generated content\n- 0.3% false positive rate\n- Average verification time: 2.3 seconds\n\nThis is the foundation for a more authentic internet.`,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
      aiScore: 0.01,
      aiScoreStatus: 'pass',
      verificationMethod: 'Multi-Factor Analysis',
      sessionId: '2B7X...44F',
      endorsements: 389,
      comments: 67,
      reposts: 124,
      tags: ['research', 'authentication', 'security'],
      status: 'published'
    },
    {
      id: 'post-004',
      author: this.getAuthorFromUser(this.demoUsers[0]),
      content: `Just submitted my weekly content creation challenge entry! This week's theme was "Nature through Human Eyes" and I captured this sunrise over the mountains during my morning hike.\n\nNo filters, no AI enhancement - just pure human perspective and a steady hand. Sometimes the simplest moments are the most beautiful.`,
      media: [
        {
          id: 'm2',
          type: 'image',
          url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop',
          caption: 'Morning Sunrise',
          metadata: { device: 'iPhone 15 Pro', timestamp: new Date(), isVerified: true }
        }
      ],
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      aiScore: 0.05,
      aiScoreStatus: 'pass',
      verificationMethod: 'Device Metadata',
      endorsements: 256,
      comments: 42,
      reposts: 38,
      tags: ['photography', 'nature', 'challenge'],
      status: 'published'
    },
    {
      id: 'post-005',
      author: this.getAuthorFromUser(this.demoUsers[1]),
      content: `Thought experiment: If we can verify human-generated content with 99%+ accuracy, what does this mean for the future of creative industries?\n\nI believe we'll see:\n1. Premium pricing for verified human content\n2. New career paths in content verification\n3. Renaissance of traditional arts\n4. Hybrid human-AI disclosure standards\n\nWhat are your thoughts?`,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      aiScore: 0.8,
      aiScoreStatus: 'pass',
      endorsements: 523,
      comments: 89,
      reposts: 67,
      tags: ['future', 'creativity', 'discussion'],
      status: 'published'
    }
  ];

  // Demo Transactions
  private readonly demoTransactions: Transaction[] = [
    {
      id: 'tx-001',
      type: 'staking_reward',
      amount: 45.20,
      currency: 'ROO',
      status: 'completed',
      description: 'Staking Reward',
      reference: 'Yield Payout #4402',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 'tx-002',
      type: 'post_reward',
      amount: 50.00,
      currency: 'ROO',
      status: 'completed',
      description: 'Content Verified Reward',
      reference: 'Post #post-001',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'tx-003',
      type: 'post_cost',
      amount: -25.00,
      currency: 'ROO',
      status: 'completed',
      description: 'Post Submission Fee',
      reference: 'Post #post-004',
      createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      id: 'tx-004',
      type: 'stake',
      amount: -2000.00,
      currency: 'ROO',
      status: 'completed',
      description: 'Staking Deposit',
      reference: 'Lock Period: 90 days',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'tx-005',
      type: 'moderation_reward',
      amount: 15.00,
      currency: 'ROO',
      status: 'completed',
      description: 'Moderation Participation',
      reference: 'Case #MOD-2841',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'tx-006',
      type: 'bonus',
      amount: 100.00,
      currency: 'ROO',
      status: 'completed',
      description: 'Trust Level Achievement',
      reference: 'Reached Level 3',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    }
  ];

  // Demo Notifications
  private readonly demoNotifications: Notification[] = [
    {
      id: 'notif-001',
      type: 'post_verified',
      title: 'Content Verified',
      message: 'Your post "Market Analysis Q4" has been verified. You earned 50.00 ROO.',
      icon: 'verified',
      iconColor: 'blue',
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: 'notif-002',
      type: 'comment_reply',
      title: 'New Reply',
      message: 'Sarah Chen replied to your comment on "Algorithmic Transparency".',
      isRead: false,
      createdAt: new Date(Date.now() - 60 * 60 * 1000)
    },
    {
      id: 'notif-003',
      type: 'moderation_alert',
      title: 'Moderation Alert',
      message: 'Content #9921 flagged for AI Probability check. Review required.',
      icon: 'warning',
      iconColor: 'orange',
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
    },
    {
      id: 'notif-004',
      type: 'staking_reward',
      title: 'Staking Reward',
      message: 'Staking Yield Payout: +12.50 ROO deposited to your wallet.',
      icon: 'savings',
      iconColor: 'green',
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
    },
    {
      id: 'notif-005',
      type: 'endorsement',
      title: 'New Endorsement',
      message: 'David Chen endorsed your post about authentication systems.',
      icon: 'thumb_up',
      iconColor: 'emerald',
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'notif-006',
      type: 'appeal_update',
      title: 'Appeal Approved',
      message: 'Your appeal for Case #4921 has been approved. +50 ROO restored.',
      icon: 'gavel',
      iconColor: 'green',
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ];

  // Demo Appeals
  private readonly demoAppeals: Appeal[] = [
    {
      id: 'appeal-001',
      caseId: '#4921',
      postId: 'post-flagged-001',
      postType: 'image',
      status: 'approved',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      aiScore: 45.2,
      defenseArgument: 'The image was taken with my camera and edited manually in Lightroom.',
      rooCoinAtRisk: 50,
      outcome: {
        decision: 'approved',
        reason: 'Manual editing confirmed through metadata analysis',
        rooCoinResult: 50
      }
    },
    {
      id: 'appeal-002',
      caseId: '#4810',
      postId: 'post-flagged-002',
      postType: 'article',
      status: 'rejected',
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      resolvedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      aiScore: 92.4,
      defenseArgument: 'I wrote this article myself over several days.',
      rooCoinAtRisk: 75,
      outcome: {
        decision: 'rejected',
        reason: 'High probability of synthetic generation. GPT-4 syntax patterns detected.',
        rooCoinResult: -75
      }
    },
    {
      id: 'appeal-003',
      caseId: '#5102',
      postId: 'post-flagged-003',
      postType: 'text',
      status: 'pending',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      aiScore: 38.5,
      rooCoinAtRisk: 40
    }
  ];

  // Signals for reactive state
  currentUser = signal<User | null>(null);
  posts = signal<Post[]>(this.demoPosts);
  transactions = signal<Transaction[]>(this.demoTransactions);
  notifications = signal<Notification[]>(this.demoNotifications);
  appeals = signal<Appeal[]>(this.demoAppeals);

  // Wallet overview computed
  walletOverview = computed<WalletOverview>(() => {
    const user = this.currentUser();
    if (!user) {
      return {
        totalBalance: 0,
        availableBalance: 0,
        stakedBalance: 0,
        pendingRewards: 0,
        usdValue: 0,
        currentAPY: 5.2,
        totalEarned: 0,
        monthlyEarnings: 0
      };
    }
    return {
      totalBalance: user.rooCoinBalance,
      availableBalance: user.rooCoinBalance - user.stakedAmount,
      stakedBalance: user.stakedAmount,
      pendingRewards: 45.20,
      usdValue: user.rooCoinBalance * 0.34,
      currentAPY: 5.2,
      totalEarned: 845.00,
      monthlyEarnings: 120.00
    };
  });

  // Market data
  rooCoinMarket = signal<RooCoinMarket>({
    price: 0.34,
    change24h: 2.4,
    volume24h: 4200000,
    marketCap: 84000000
  });

  // Staking info computed
  stakingInfo = computed<StakingInfo>(() => {
    const user = this.currentUser();
    return {
      totalLocked: user?.stakedAmount || 0,
      lockPeriodDays: 90,
      unlockDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      currentAPY: 5.2,
      projectedEarnings: (user?.stakedAmount || 0) * 0.052 / 4,
      reputationBonus: 150
    };
  });

  // Unread notifications count
  unreadNotificationsCount = computed(() => {
    return this.notifications().filter(n => !n.isRead).length;
  });

  // Trust leaders
  trustLeaders = computed(() => {
    return [...this.demoUsers]
      .sort((a, b) => b.trustScore - a.trustScore)
      .slice(0, 5);
  });

  private getAuthorFromUser(user: User): PostAuthor {
    return {
      id: user.id,
      username: user.username,
      displayName: `${user.firstName} ${user.lastName}`,
      avatar: user.avatar,
      isVerified: user.isVerified,
      trustScore: user.trustScore
    };
  }

  // Methods
  login(email: string, password: string): boolean {
    const user = this.demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      this.currentUser.set(user);
      localStorage.setItem('noai_user', JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('noai_user');
  }

  loadStoredUser(): void {
    const stored = localStorage.getItem('noai_user');
    if (stored) {
      this.currentUser.set(JSON.parse(stored));
    }
  }

  getUserById(id: string): User | undefined {
    return this.demoUsers.find(u => u.id === id);
  }

  getAllUsers(): User[] {
    return this.demoUsers;
  }

  addPost(postData: Partial<Post>): Post {
    const user = this.currentUser();
    if (!user) throw new Error('Not authenticated');

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: this.getAuthorFromUser(user),
      content: postData.content || '',
      title: postData.title,
      media: postData.media,
      createdAt: new Date(),
      aiScore: Math.random() * 2,
      aiScoreStatus: 'pass',
      verificationMethod: 'Keystroke Dynamics',
      sessionId: this.generateSessionId(),
      endorsements: 0,
      comments: 0,
      reposts: 0,
      tags: postData.tags,
      status: 'published'
    };

    this.posts.update(posts => [newPost, ...posts]);
    return newPost;
  }

  endorsePost(postId: string): void {
    this.posts.update(posts =>
      posts.map(p =>
        p.id === postId
          ? { ...p, endorsements: p.endorsements + 1, isEndorsed: true }
          : p
      )
    );
  }

  markNotificationAsRead(id: string): void {
    this.notifications.update(notifications =>
      notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      )
    );
  }

  markAllNotificationsAsRead(): void {
    this.notifications.update(notifications =>
      notifications.map(n => ({ ...n, isRead: true }))
    );
  }

  submitAppeal(appeal: Partial<Appeal>): Appeal {
    const newAppeal: Appeal = {
      id: `appeal-${Date.now()}`,
      caseId: `#${Math.floor(5000 + Math.random() * 1000)}`,
      postId: appeal.postId || '',
      postType: appeal.postType || 'text',
      status: 'pending',
      submittedAt: new Date(),
      aiScore: appeal.aiScore || 0,
      defenseArgument: appeal.defenseArgument,
      rooCoinAtRisk: appeal.rooCoinAtRisk || 50
    };

    this.appeals.update(appeals => [newAppeal, ...appeals]);
    return newAppeal;
  }

  private generateSessionId(): string {
    const chars = '0123456789ABCDEF';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    result += '...';
    for (let i = 0; i < 3; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  // Demo data stats
  getDailyStats() {
    return {
      verifiedContent: 8421,
      aiBlocked: 1204,
      totalPosts: 9625,
      humanPercentage: 87.5
    };
  }
}

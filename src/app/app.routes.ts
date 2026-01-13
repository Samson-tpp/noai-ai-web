import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { Router } from '@angular/router';

// Auth Guard
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  return router.parseUrl('/auth');
};

// Public Guard (redirect to feed if already logged in)
const publicGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }
  return router.parseUrl('/feed');
};

export const routes: Routes = [
  // Public routes
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register.component').then(m => m.RegisterComponent),
    canActivate: [publicGuard]
  },
  {
    path: 'email-verification',
    loadComponent: () => import('./auth/email-verification.component').then(m => m.EmailVerificationComponent)
  },

  // Protected routes with layout
  {
    path: '',
    loadComponent: () => import('./layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'feed',
        loadComponent: () => import('./pages/feed/feed.component').then(m => m.FeedComponent)
      },
      {
        path: 'discover',
        loadComponent: () => import('./pages/discover/discover.component').then(m => m.DiscoverComponent)
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/create/create.component').then(m => m.CreateComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'user/:id',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      },
      {
        path: 'wallet',
        loadComponent: () => import('./pages/wallet/wallet.component').then(m => m.WalletComponent)
      },
      {
        path: 'staking',
        loadComponent: () => import('./pages/staking/staking.component').then(m => m.StakingComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      {
        path: 'appeals',
        loadComponent: () => import('./pages/appeals/appeals.component').then(m => m.AppealsComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'support',
        loadComponent: () => import('./pages/support/support.component').then(m => m.SupportComponent)
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'auth'
  }
];

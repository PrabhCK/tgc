import { Routes } from '@angular/router';

import { Empty } from '../empty/empty';
import { AuthGuard } from '@/guards/auth.guard';
import { Users } from './users/users';

import { Dashboard } from './dashboard/dashboard';
import { Payments } from './payments/payments';
import { Accounts } from './accounts/accounts';
import { Package } from './package/package';
import { Coupon } from './coupon/coupon';

export default [
    
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [AuthGuard],
    },
    {
        path: 'users',
        component: Users,
        canActivate: [AuthGuard],
    },
    {
        path: 'payment',
        component: Payments,
        canActivate: [AuthGuard],
    },
    {
        path: 'account',
        component: Accounts,
        canActivate: [AuthGuard],
    },
    {
        path: 'packages',
        component: Package,
        canActivate: [AuthGuard],
    },
    {
        path: 'coupon',
        component: Coupon,
        canActivate: [AuthGuard],
    },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;

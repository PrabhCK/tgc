import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app-layout/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/portal/notfound/notfound';
import { AuthGuard } from '@/guards/auth.guard';
import { TermsAndCondition } from '@/pages/terms-and-condition/terms-and-condition';

export const appRoutes: Routes = [

    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },

    {
        path: '',
        component: AppLayout,
        canActivate: [AuthGuard],
        children: [
            { path: 'portal', loadChildren: () => import('./app/pages/portal/pages.routes') },
            { path: 'admin', loadChildren: () => import('./app/pages/admin/admin.routes') }

        ]
    },
    { path: 'home', component: Landing },
    { path: 'terms-and-conditions', component: TermsAndCondition },
    { path: 'notfound', component: Notfound },
    // { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];

import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/auth/login',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
            },
        ],
    },
    {
        path: 'home',
        children: [
            {
                path: '',
                loadChildren: () => import('./features/home/home.routes').then((m) => m.homeRoutes),
            },
        ],
    },
    {
        path: '**',
        redirectTo: '/auth/login',
    }

];
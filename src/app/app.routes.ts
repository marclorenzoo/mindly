import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';
import { Dashboard } from './features/dashboard/dashboard';
import { Stats } from './features/stats/stats';
import { Habits } from './features/habits/habits';
import { Tasks } from './features/tasks/tasks';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';

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


    // path: '',
    // component: MainLayout,
    // children: [
    //     {
    //         path: '',
    //         redirectTo: 'dashboard',
    //         pathMatch: 'full',
    //     },
    //     {
    //         path: 'dashboard',
    //         component: Dashboard,
    //     },
    //     {
    //         path: 'tasks',
    //         component: Tasks,
    //     },
    //     {
    //         path: 'habits',
    //         component: Habits,
    //     },
    //     {
    //         path: 'stats',
    //         component: Stats,
    //     },

    //],

];
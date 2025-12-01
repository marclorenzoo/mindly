// home.routes.ts

import { Routes } from "@angular/router";
import { Home } from "./home";

export const homeRoutes: Routes = [

    {
        path: '',
        component: Home,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./../dashboard/dashboard').then((m) => m.Dashboard),
            },
            {
                path: 'tasks',
                loadComponent: () => import('./../tasks/tasks').then((m) => m.Tasks),
            },
            {
                path: 'habits',
                loadComponent: () => import('./../habits/habits').then((m) => m.Habits),
            },
            {
                path: 'stats',
                loadComponent: () => import('./../stats/stats').then((m) => m.Stats),
            }
        ]
    }
]

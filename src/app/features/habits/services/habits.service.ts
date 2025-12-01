import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Habit, ActivityLog } from '../models/habit.model';
import data from '../data/data.json';

@Injectable({
    providedIn: 'root'
})
export class HabitsService {

    constructor() { }

    getHabits(): Observable<Habit[]> {
        return of(data.habits);
    }

    getActivityLogs(): Observable<ActivityLog[]> {
        // Generate mock activity logs for the past year
        const logs: ActivityLog[] = [];
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
            // Random activity level 0-4
            // Skew towards 0 to make it look realistic (not every day is productive)
            const rand = Math.random();
            let count = 0;
            if (rand > 0.8) count = 4;
            else if (rand > 0.6) count = 3;
            else if (rand > 0.4) count = 2;
            else if (rand > 0.2) count = 1;

            logs.push({
                date: d.toISOString().split('T')[0],
                count: count
            });
        }
        return of(logs);
    }

    toggleHabit(id: string): Observable<boolean> {
        // Mock toggle
        console.log(`Toggled habit ${id}`);
        return of(true);
    }
}

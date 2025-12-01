export interface Habit {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    streak: number;
    color: string;
    icon: string;
    target: number; // e.g., 5 times a week
    progress: number;
}

export interface ActivityLog {
    date: string; // ISO format YYYY-MM-DD
    count: number; // Activity level (0-4)
}

export interface Habit {
    // Identificación
    id: number;
    userId: number;

    // Información básica
    title: string;
    description: string;

    // Visualización
    color: string;
    icon: string;

    // Configuración
    targetPerWeek: number;

    // Rachas
    currentStreak: number;
    bestStreak: number;

    // Control de actividad
    lastCompletedDate: string | null;

    // Progreso semanal
    currentWeekCompletions: number;
    weekStartDate: string;

    // Metadata
    createdAt: string;
    isActive: boolean;
}

export interface HabitActivity {
    id: string;
    habitId: string;
    userId: number;
    date: string;
    createdAt: string;
}

export interface HabitsData {
    habits: Habit[];
    activities: HabitActivity[];
}

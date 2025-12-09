import { Injectable, signal } from '@angular/core';
import { Habit, HabitsData } from '../models/habit.model';

@Injectable({
  providedIn: 'root',
})
export class HabitsService {
  constructor() { }

  private readonly STORAGE_KEY = 'habits';
  private _habitsData = signal<HabitsData>(this.loadFromLocalStorage());

  private loadFromLocalStorage(): HabitsData {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw
      ? (JSON.parse(raw) as HabitsData)
      : { habits: [], activities: [] };
  }

  getHabitsData(): HabitsData {
    return this._habitsData();
  }

  getHabitsByUser(userId: number): Habit[] {
    const data = this.getHabitsData();
    return data.habits.filter((habit) => habit.userId === userId);
  }

  getHabitById(id: number): Habit | undefined {
    const data = this.getHabitsData();
    const result = data.habits.find((habit) => habit.id === id);
    return result ? result : undefined;
  }

  // --- Lógica de Negocio ---

  /**
   * Alterna el estado de completado de un hábito para una fecha específica.
   */
  toggleCompletion(habitId: number, date: string): void {
    const data = this.getHabitsData();
    const habitIndex = data.habits.findIndex((h) => h.id === habitId);

    if (habitIndex === -1) return;

    const habit = data.habits[habitIndex];
    const activityIndex = data.activities.findIndex(
      (a) => a.habitId === habitId.toString() && a.date === date
    );

    if (activityIndex !== -1) {
      // Si ya existe actividad, la eliminamos (desmarcar)
      data.activities.splice(activityIndex, 1);
      this.recalculateHabitStats(habit, data.activities);
    } else {
      // Si no existe, la creamos (marcar)
      const newActivity = {
        id: crypto.randomUUID(),
        habitId: habitId.toString(),
        userId: habit.userId,
        date: date,
        createdAt: new Date().toISOString(),
      };
      data.activities.push(newActivity);
      this.recalculateHabitStats(habit, data.activities);
    }

    // Guardamos todo
    this.saveHabitsData(data);
  }

  /**
   * Verifica si un hábito está completado en una fecha dada.
   */
  isCompleted(habitId: number, date: string): boolean {
    const data = this.getHabitsData();
    return data.activities.some(
      (a) => a.habitId === habitId.toString() && a.date === date
    );
  }

  /**
   * Recalcula estadísticas: racha actual, mejor racha, progreso semanal.
   */
  private recalculateHabitStats(habit: Habit, allActivities: any[]): void {
    const habitActivities = allActivities
      .filter((a) => a.habitId === habit.id.toString())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 1. Calcular Racha Actual
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if completed today
    const completedToday = habitActivities.some(a => {
      const d = new Date(a.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });

    let checkDate = new Date(today);
    if (!completedToday) {
      // If not completed today, check yesterday for streak continuation
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      const hasActivity = habitActivities.some(a => a.date.startsWith(dateStr));

      if (hasActivity) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    habit.currentStreak = currentStreak;

    // 2. Calcular Mejor Racha (Simplificado: si la actual es mayor, actualizamos)
    if (habit.currentStreak > habit.bestStreak) {
      habit.bestStreak = habit.currentStreak;
    }

    // 3. Progreso Semanal
    const startOfWeek = this.getStartOfWeek(new Date());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    const weeklyCompletions = habitActivities.filter((a) => {
      const d = new Date(a.date);
      return d >= startOfWeek && d <= endOfWeek;
    }).length;

    habit.currentWeekCompletions = weeklyCompletions;

    // Actualizar última fecha completada si es hoy
    if (completedToday) {
      habit.lastCompletedDate = new Date().toISOString();
    }
  }

  private getStartOfWeek(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Ajustar al lunes
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // --- Métodos CRUD existentes (mantenidos) ---

  private saveHabitsData(data: HabitsData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    this._habitsData.set(data); // Actualizar señal
  }

  createHabit(habit: Habit): void {
    const data = this.getHabitsData();
    data.habits.push(habit);
    this.saveHabitsData(data);
  }

  updateHabit(inputHabit: Habit): void {
    const data = this.getHabitsData();
    const index = data.habits.findIndex((habit) => habit.id === inputHabit.id);

    if (index !== -1) {
      data.habits[index] = inputHabit;
      this.saveHabitsData(data);
    } else {
      console.log('Hábito no encontrado');
    }
  }

  deleteHabitById(id: number): void {
    const data = this.getHabitsData();
    const index = data.habits.findIndex((habit) => habit.id === id);

    if (index !== -1) {
      data.habits.splice(index, 1);
      // También borrar actividades asociadas
      data.activities = data.activities.filter(a => a.habitId !== id.toString());
      this.saveHabitsData(data);
    } else {
      console.log('Hábito no encontrado');
    }
  }
}

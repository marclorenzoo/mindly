import { Injectable, signal } from '@angular/core';
import { Habit, HabitsData } from '../models/habit.model';

@Injectable({
  providedIn: 'root',
})
export class HabitsService {
  constructor() {}

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

  private saveHabitsData(data: HabitsData): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
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
      this.saveHabitsData(data);
    } else {
      console.log('Hábito no encontrado');
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HabitsService } from './services/habits.service';
import { ContributionGraph } from "./components/contribution-graph/contribution-graph";
import { Habit } from './models/habit.model';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, ContributionGraph, ReactiveFormsModule],
  templateUrl: './habits.html',
  styles: ``
})
export class Habits {

  currentDate = new Date();
  viewMode: 'today' | 'week' | 'month' = 'today';

  // Mock user ID for now
  userId = 1;

  // CRUD State
  isModalOpen = false;
  isEditing = false;
  habitForm: FormGroup;
  selectedIcon = 'pi pi-star'; // Default icon

  icons = [
    'pi pi-star', 'pi pi-heart', 'pi pi-briefcase', 'pi pi-book',
    'pi pi-calendar', 'pi pi-check-circle', 'pi pi-clock', 'pi pi-cog',
    'pi pi-compass', 'pi pi-envelope', 'pi pi-globe', 'pi pi-home',
    'pi pi-info-circle', 'pi pi-map-marker', 'pi pi-moon', 'pi pi-palette',
    'pi pi-play', 'pi pi-plus', 'pi pi-power-off', 'pi pi-search',
    'pi pi-send', 'pi pi-server', 'pi pi-shield', 'pi pi-shopping-bag',
    'pi pi-shopping-cart', 'pi pi-sliders-h', 'pi pi-sort-alt', 'pi pi-sun',
    'pi pi-tag', 'pi pi-thumbs-up', 'pi pi-trash', 'pi pi-user',
    'pi pi-video', 'pi pi-volume-up', 'pi pi-wallet', 'pi pi-wifi'
  ];

  // Toast State
  toastMessage: string | null = null;
  toastTimeout: any;

  constructor(
    private habitsService: HabitsService,
    private fb: FormBuilder
  ) {
    this.habitForm = this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      targetPerWeek: [7, [Validators.required, Validators.min(1), Validators.max(7)]],
      icon: [this.selectedIcon]
    });
  }

  get habits() {
    return this.habitsService.getHabitsByUser(this.userId);
  }

  get todayHabits() {
    // For now, show all habits for the user as "today's habits"
    // In a real app, we might filter by frequency (e.g., if it's a Monday habit)
    return this.habits;
  }

  toggleHabit(habitId: number) {
    const dateStr = this.currentDate.toISOString().split('T')[0];
    const wasCompleted = this.isCompleted(habitId);

    this.habitsService.toggleCompletion(habitId, dateStr);

    // Check if we just completed it and if weekly target is met
    if (!wasCompleted) {
      const habit = this.habitsService.getHabitById(habitId);
      if (habit && habit.currentWeekCompletions >= habit.targetPerWeek) {
        this.triggerConfetti();
        this.showToast('¡Objetivo semanal completado! 🎉');
      }
    }
  }

  triggerConfetti() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8'] // Blue shades
    });
  }

  isCompleted(habitId: number): boolean {
    const dateStr = this.currentDate.toISOString().split('T')[0];
    return this.habitsService.isCompleted(habitId, dateStr);
  }

  get formattedDate(): string {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(this.currentDate);
  }

  get progressPercentage(): number {
    const total = this.todayHabits.length;
    if (total === 0) return 0;
    const completed = this.todayHabits.filter(h => this.isCompleted(h.id)).length;
    return Math.round((completed / total) * 100);
  }

  // --- CRUD Methods ---

  openCreateModal() {
    this.isEditing = false;
    this.selectedIcon = 'pi pi-star';
    this.habitForm.reset({
      targetPerWeek: 7,
      icon: this.selectedIcon
    });
    this.isModalOpen = true;
  }

  openEditModal(habit: Habit) {
    this.isEditing = true;
    this.selectedIcon = habit.icon;
    this.habitForm.patchValue({
      id: habit.id,
      title: habit.title,
      description: habit.description,
      targetPerWeek: habit.targetPerWeek,
      icon: habit.icon
    });
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  selectIcon(icon: string) {
    this.selectedIcon = icon;
    this.habitForm.patchValue({ icon: icon });
  }

  saveHabit() {
    if (this.habitForm.invalid) return;

    const formValue = this.habitForm.value;

    if (this.isEditing) {
      // Update
      const habitToUpdate: Habit = {
        ...this.habitsService.getHabitById(formValue.id)!, // Get existing to keep other fields
        title: formValue.title,
        description: formValue.description,
        targetPerWeek: formValue.targetPerWeek,
        icon: formValue.icon
      };
      this.habitsService.updateHabit(habitToUpdate);
      this.showToast('Hábito actualizado correctamente');
    } else {
      // Create
      const newHabit: Habit = {
        id: Date.now(), // Simple ID generation
        userId: this.userId,
        title: formValue.title,
        description: formValue.description,
        color: 'blue', // Default color
        icon: formValue.icon,
        targetPerWeek: formValue.targetPerWeek,
        currentStreak: 0,
        bestStreak: 0,
        lastCompletedDate: null,
        currentWeekCompletions: 0,
        weekStartDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isActive: true
      };
      this.habitsService.createHabit(newHabit);
      this.showToast('Hábito creado correctamente');
    }

    this.closeModal();
  }

  deleteHabit(habitId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
      this.habitsService.deleteHabitById(habitId);
      this.closeModal();
      this.showToast('Hábito eliminado correctamente');
    }
  }

  private showToast(message: string) {
    this.toastMessage = message;
    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.toastMessage = null;
    }, 3000);
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitsService } from './services/habits.service';
import { Habit, ActivityLog } from './models/habit.model';
import { ContributionGraph } from "./components/contribution-graph/contribution-graph";

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, ContributionGraph],
  templateUrl: './habits.html',
  styles: ``
})
export class Habits implements OnInit {
  habits: Habit[] = [];
  activityLogs: ActivityLog[] = [];
  months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private habitsService: HabitsService) { }

  ngOnInit(): void {
    this.habitsService.getHabits().subscribe(habits => {
      this.habits = habits;
    })

    this.habitsService.getActivityLogs().subscribe(data => {
      this.activityLogs = data;
    });
  }

  getColor(count: number): string {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-green-200';
    if (count === 2) return 'bg-green-400';
    if (count === 3) return 'bg-green-600';
    return 'bg-green-800';
  }

  toggleHabit(habit: Habit): void {
    this.habitsService.toggleHabit(habit.id).subscribe(() => {
      habit.completed = !habit.completed;
    });
  }
}

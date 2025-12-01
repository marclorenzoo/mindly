import { Component, Input } from '@angular/core';
import { ActivityLog } from '../../models/habit.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contribution-graph',
  imports: [CommonModule],
  templateUrl: './contribution-graph.html',
  styleUrl: './contribution-graph.css',
})
export class ContributionGraph {


  @Input() activityLogs: ActivityLog[] = [];

  getColor(count: number): string {
    if (count === 0) return 'bg-gray-100';
    if (count === 1) return 'bg-blue-200';
    if (count === 2) return 'bg-blue-400';
    if (count === 3) return 'bg-blue-600';
    return 'bg-blue-800';
  }

}

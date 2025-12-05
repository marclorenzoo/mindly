import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HabitsService } from './services/habits.service';
import { ContributionGraph } from "./components/contribution-graph/contribution-graph";

@Component({
  selector: 'app-habits',
  standalone: true,
  imports: [CommonModule, ContributionGraph],
  templateUrl: './habits.html',
  styles: ``
})
export class Habits {

  constructor(private habitsService: HabitsService) { }
}

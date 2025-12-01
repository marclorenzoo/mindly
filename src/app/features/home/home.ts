import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Sidebar } from "../../layout/sidebar/sidebar";

@Component({
  selector: 'app-home',
  imports: [RouterOutlet, CommonModule, Sidebar],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

}

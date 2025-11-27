import { Component } from '@angular/core';
import { Sidebar } from "../../components/sidebar/sidebar";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'main-layout',
  imports: [Sidebar, RouterOutlet],
  templateUrl: './main-layout.html',
  styles: ``,
})
export class MainLayout {

}

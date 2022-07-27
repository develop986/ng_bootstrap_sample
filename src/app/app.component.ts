import { Component } from '@angular/core';
import { SwUpdateService } from "./pwa/sw.update.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'bootstrap';

  constructor(private swUpdateService: SwUpdateService) { }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public isMenuMain = true;
  public isMenuSub1 = true;

  constructor() { }

  ngOnInit(): void {
  }

}

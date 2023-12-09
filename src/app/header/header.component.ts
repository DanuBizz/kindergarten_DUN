import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public title: string = 'Kindergarden SignUP!';
  public imagePath: string = "./../assets/images/signup2.jpg";

  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  linkDisabled(tabRoute : string): boolean {
    return this.router.url !== tabRoute;
  }
}

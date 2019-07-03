import { Component } from '@angular/core';
import { UserInfo } from './UserInfo';
import { Router } from '@angular/router';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'cloudike';
  constructor(private router : Router)
  {
    if (!UserInfo.isLogin())
      this.router.navigate(['/oauth']);
    else
      this.router.navigate(['/drive']);
  }
}

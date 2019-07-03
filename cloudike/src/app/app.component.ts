import { Component } from '@angular/core';
import { UserInfo } from './UserInfo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cloudike';
  constructor(private router : Router)
  {
    if (!UserInfo.isLogin())
      this.router.navigate(['/oauth']);
  }
}

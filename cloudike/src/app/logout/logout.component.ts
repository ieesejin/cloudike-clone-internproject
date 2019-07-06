import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../UserInfo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router) { 
    UserInfo.Logout();
    this.router.navigate(['/']);
  }

  ngOnInit() {
  }

}

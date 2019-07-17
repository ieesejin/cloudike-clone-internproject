import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../UserInfo';
import { Router } from '@angular/router';
import { FileManagement } from '../drive/FileManagement';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router) { 
    UserInfo.Logout();
    FileManagement.clean();
    this.router.navigate(['/']);
  }

  ngOnInit() {
  }

}

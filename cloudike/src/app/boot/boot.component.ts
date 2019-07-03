import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from '../UserInfo';

@Component({
  selector: 'app-boot',
  templateUrl: './boot.component.html',
  styleUrls: ['./boot.component.css']
})
export class BootComponent implements OnInit {
  private static object : BootComponent;
  constructor(private cookieservice : CookieService) { 
    BootComponent.object = this;
    console.log(UserInfo.user_name());
    console.log(UserInfo.token());
  }

  ngOnInit() {
  }
  
}

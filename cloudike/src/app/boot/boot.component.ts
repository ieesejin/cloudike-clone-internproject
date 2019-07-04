import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { UserInfo } from '../UserInfo';

import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-boot',
  templateUrl: './boot.component.html',
  styleUrls: ['./boot.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BootComponent implements OnInit {
  private static object : BootComponent;
  constructor(private cookieservice : CookieService, private router : Router) { 
    BootComponent.object = this;
    console.log(UserInfo.user_name());
    console.log(UserInfo.token());
    
    if (this.router.url == "/")
    {
      if (!UserInfo.isLogin())
        this.router.navigate(['/oauth']);
      else
      {
        //this.router.navigate(['/drive']);
      }
    }
  }

  ngOnInit() {
  }
  
}

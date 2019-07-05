import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UserInfo } from '../UserInfo';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-boot',
  templateUrl: './boot.component.html',
  styleUrls: ['./boot.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BootComponent implements OnInit {
  constructor(private router: Router, private location: Location) { 
    console.log(UserInfo.user_name());
    console.log(UserInfo.token());

    // this.router.url is not working (because of no loading, BootComponent is working in bootstrap)
    // So use location class.
    let path = this.location.path();
    console.log(this.location.path());
    if (UserInfo.isLogin())
    {
      if (path == "")
        this.router.navigate(['/drive']);
    }
    else
    {
      if (path.indexOf("/oauth") != 0)
        this.router.navigate(['/oauth']);
    }
  }

  ngOnInit() {
  }
  
}

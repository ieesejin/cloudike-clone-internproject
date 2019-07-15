import { Component, OnInit } from '@angular/core';
import { UserInfo } from '../UserInfo';

import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-boot',
  templateUrl: './boot.component.html',
  styleUrls: ['./boot.component.css']
})
export class BootComponent implements OnInit {
  constructor(private router: Router, private location: Location) { 
    // this.router.url is not working (because of no loading, BootComponent is working in bootstrap)
    // So use location class.
    let path = this.location.path();

    // 만약 유저가 로그인한 상태라면
    if (UserInfo.isLogin())
    {
      // 루트를 가르키고 있다면 drive 페이지로 안내
      if (path == "")
        this.router.navigate(['/drive']);
    }
    else
    {
      // 로그인을 하지 않았으면 무조건 oauth 페이지로 안내
      if (path.indexOf("/oauth") != 0)
        this.router.navigate(['/oauth']);
    }
  }

  ngOnInit() {
  }
  
}

import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient } from  "@angular/common/http";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserInfo } from '../UserInfo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css'],

  encapsulation: ViewEncapsulation.None
})
export class OauthComponent implements OnInit {

  private authorize_url: string;
  private request_token: string;

  private error: string;
  private error_type: string;
  form: FormGroup;
  constructor(private http:HttpClient, private router : Router) { 
    this.form = new FormGroup({
      id: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ])
    });

    this.http.post("https://api.cloudike.kr/api/1/accounts/oauth_url/",null).subscribe(data => {
      this.authorize_url = data["authorize_url"];
      this.request_token = data["request_token"];
    });
  }

  ngOnInit() {

  }

  public onSubmit(value)
  {
    let body = new FormData();
    body.append('login', "email:" + value.id);
    body.append('password', value.password);
    this.http.post(this.authorize_url,body).subscribe(data => {
      console.log(data);
      // Read the result field from the JSON response.
      UserInfo.Save(data);
      this.router.navigate(['/']);
    },
    http_error => {
      this.error_type  = http_error.error["code"];
      // Read the result field from the JSON response.
      if (this.error_type == "Unauthorized")
      {
        this.error = "이메일/비밀번호가 올바르지 않습니다.";
      }
      if (this.error_type == "LastAttempt")
      {
        this.error = "이메일이나 비밀번호가 올바르지 않습니다. 다시 틀릴 경우 차단 됩니다!";
      }
      if (this.error_type == "UserTemporarilyLocked")
      {
        this.error = "로그인 실패 10회로 사용자가 일시적으로 사용 정지 상태입니다. 30분 후 다시 시도하세요.";
      }
    });
  }
}

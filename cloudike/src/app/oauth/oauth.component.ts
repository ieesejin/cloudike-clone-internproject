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

  // error, error_type은 html에서 보여줄 오류 메세지를 담고 있음.
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

    // 처음 이 페이지에 들어오면 api서버에 로그인을 할 수 있는 임시키(토큰)을 요청한다.
    this.http.post("https://api.cloudike.kr/api/1/accounts/oauth_url/",null).subscribe(data => {
      this.authorize_url = data["authorize_url"];
      this.request_token = data["request_token"];
    });
  }

  ngOnInit() {

  }

  // html에서 제출 버튼이 눌리면 아래의 함수가 실행
  public onSubmit(value)
  {
    // 로그인할 아이디와 패스워드를 value로부터 얻어내고, 이것을 http 요청으로 보내기 위해 FormData라는 클래스에 담는다.
    let body = new FormData();
    body.append('login', "email:" + value.id);
    body.append('password', value.password);

    // 그리고 처음에 받은 로그인 인증 주소로 해당 데이터를 전송한다.
    this.http.post(this.authorize_url,body).subscribe(
      // 성공적으로 로그인이 된 경우
      data => {
        // data에는 JSON 형식으로 유저 데이터가 담겨있음.
        // 이 데이터를 UserInfo 클래스에 저장
        UserInfo.Save(data);
        
        // 메인 페이지로 이동
        // 이때 app-routing.module.ts에 따라 '/'에 해당되는 컴포넌트가 실행된다.
        this.router.navigate(['/']);
      },
      // 로그인에 실패한 경우
      http_error => {
        // 실패 이유를 error_type에 적어둔다.
        this.error_type  = http_error.error["code"];
        // 에러 타입에 따른 메세지를 적는다. 
        // 이 메세지는 Angular의 데이터 바인딩 ( {{error}} 와 같은 태그) 자동으로 웹 페이지에 표시된다.
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

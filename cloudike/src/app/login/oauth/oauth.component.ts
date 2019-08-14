import { Component, OnInit } from '@angular/core';
import { HttpClient } from  "@angular/common/http";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserInfo } from '../../UserInfo';
import { Router } from '@angular/router';
import { CloudikeApiService } from 'src/app/service/CloudikeAPI/cloudike-api.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['../login.css']
})
export class OauthComponent implements OnInit {
  // error, error_type은 html에서 보여줄 오류 메세지를 담고 있음.
  private error: string;
  private error_type: string;
  form: FormGroup;
  constructor(private http:HttpClient, private router : Router, private api: CloudikeApiService) { 
    this.form = new FormGroup({
      id: new FormControl('', [
        Validators.required,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ])
    });
  }

  ngOnInit() {

  }

  // html에서 제출 버튼이 눌리면 아래의 함수가 실행
  public onSubmit(value)
  {
    this.api.EmailLogin(value.id, value.password).subscribe
    (
      (data) =>
      {
        UserInfo.Save(data);
        
        this.router.navigate(['/']);
      },
      (error)=>{
        this.error_type  = error.error["code"];
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
      }
    )

  }
}

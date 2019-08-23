import { Component, OnInit } from '@angular/core';
import { HttpClient } from  "@angular/common/http";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserInfo } from '../../UserInfo';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sing-up',
  templateUrl: './sing-up.component.html',
  styleUrls: ['../login.css']
})
export class SingUpComponent implements OnInit {

  private authorize_url: string;
  private request_token: string;

  // error, error_type은 html에서 보여줄 오류 메세지를 담고 있음.
  public error: string;
  public error_type: string;
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
  }

  ngOnInit() {
  }

  public onSubmit(value){
    let body = new FormData();
    body.append('lang', "ko");
    body.append('email', value.id);
    body.append('password', value.password);
    body.append('password_confirm', value.password_confirm);
    body.append('company_name', value.company_name);
    body.append('name', value.name);
    body.append('phone_number', value.phone_number);

    this.http.post("httpsS",body).subscribe(data =>{}, error=>{});
  } 
}

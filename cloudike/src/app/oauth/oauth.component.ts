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
      // Read the result field from the JSON response.
      console.log(this.request_token);
    });
  }

  ngOnInit() {
  }
  public onSubmit(value)
  {
    let body = new FormData();
    body.append('login', "email:"+value.id);
    body.append('password', value.password);
    this.http.post(this.authorize_url,body).subscribe(data => {
      // Read the result field from the JSON response.
      UserInfo.Save(data);
      this.router.navigate(['/']);
    });
  }
}

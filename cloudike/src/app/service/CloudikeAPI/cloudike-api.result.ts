import { Injectable } from '@angular/core';
import { HTTPService } from '../HttpService/httpservice.service';
import { FileItem } from '../../drive/FileItem';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';


export class CloudikeApiResult {
  private subject: Subject<any>;
  private Subscriptions = [];

  constructor(subject?: Subject<any>) {
    if (subject == null)
      this.subject = new Subject<any>();
    else
      this.subject = subject;
  }
  private add(value: Subscription): Subscription {
    this.Subscriptions.push(value);
    return value;
  }
  public subscribe(next, error = null, complete: () => void = null): Subscription {
    if (error == null)
      return this.add(this.subject.subscribe(next));
    if (complete == null)
      return this.add(this.subject.subscribe(next, error));

    return this.add(this.subject.subscribe(next, error, complete));
  }
  public unsubscribe() {
    this.Subscriptions.forEach((element: Subscription) => {
      element.unsubscribe();
    });
  }

  public AddMessage(toastr: ToastrService, success, error: {} = {}) {
    this.add(
      this.subject.subscribe(data => {
        toastr.success(success);
      }, error_info => {
        let code = error_info.error["code"];
        if (error[code] != null)
          toastr.error(error[code]);
        else
          toastr.error('에러가 발생하였습니다. (code: ' + code + ')');
      })
    );
  }

  public next(data?)
  {
    this.subject.next(data);
  }

  public error(code)
  {
    if (code instanceof HttpErrorResponse)
      this.subject.error(code);
    else
    {
      var return_error = <any>new Object(); // 오류 발생시 code를 적을 오브젝트
      return_error.error = [];
      return_error.error['code'] = code;
      this.subject.error(return_error);
    }
  }
}

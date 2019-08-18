import { Injectable } from '@angular/core';
import { HTTPService } from '../HttpService/httpservice.service';
import { FileItem } from '../../drive/FileItem';
import { Subject, Subscription, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CloudikeApiResult as CloudikeApiResult } from './cloudike-api.result';
import { HttpClient } from '@angular/common/http';
import { timeout, catchError } from 'rxjs/operators';
import { ValueStorageService } from '../ValueStorage/value-storage.service';
import { FileManagement } from 'src/app/drive/FileManagement';
import { ConvertFormat } from 'src/app/drive/ConvertFormat';

export type CloudLinkOption = { date?: Date, only_upload?: boolean, password?: string, download_max?: number };

@Injectable({
  providedIn: 'root'
})
export class CloudikeApiService {

  private lastAction: () => CloudikeApiResult = null;
  private _revertMessage = null;
  private get RevertMessage() {
    return this._revertMessage;
  }
  constructor(private hs: HTTPService, private router: Router, private http: HttpClient, private toastr: ToastrService) {
  }

  private task_name(type, value?) {
    if (value != null)
      return "클라우드 API " + type + " : " + value;
    else
      return "클라우드 API" + type;
  }

  private CleanPath(path: string) {
    var folder = FileItem.SplitPath(path);
    path = folder[folder.length - 1].path;
    return path;
  }

  private combine_path_folder(path: string, name: string) {
    if (path == null)
      return null;

    path = this.CleanPath(path);
    if (name != null) {
      if (path[path.length - 1] != '/') path += '/';
      path = path + name;
    }
    return path;
  }

  private get_parent_folder(path: string)
  {
    if (path == null)
      return null;

    var folder = FileItem.SplitPath(path);
    path = folder[folder.length - 2].path;
    return path;
  }

  private get_file_name(path: string)
  {
    
    if (path == null)
      return null;

    var folder = FileItem.SplitPath(path);
    return folder[folder.length - 1].name;
  }

  private get_path_from_value(item_or_path: string | FileItem) {
    var path;
    if (item_or_path instanceof FileItem)
      path = item_or_path.path;
    else
      path = item_or_path;
    return this.CleanPath(path);
  }

  private AddRevert(result: CloudikeApiResult, fn: () => CloudikeApiResult) {
    result.subscribe(data => {

      this._revertMessage = result.successMessage;
      this.lastAction = fn;
    });
  }

  public GetURLPath() {
    var url = decodeURI(this.router.url);
    if (url.indexOf("/drive") == 0) {
      url = url.substring("/drive".length);
      return this.CleanPath(url);
    }
    else
      return null;
  }

  public EmailLogin(email: string, password: string): CloudikeApiResult {

    var formdata = new FormData();
    formdata.append("oauth_callback", "https://cloudike.kr:443/oauth_verifier/");
    formdata.append("client_id", "dima_stable_frontend");

    var result = new CloudikeApiResult();

    // 인증 URL 요청
    this.http.post("https://api.cloudike.kr/api/1/accounts/oauth_url/", formdata).subscribe(data => {
      // 로그인 정보를 보냄
      var body = new FormData();
      body.append('login', "email:" + email);
      body.append('password', password);
      this.http.post(data['authorize_url'], body)
        .pipe(timeout(1000)).subscribe(null,// 무조건 404 에러 유발하기 때문에 ERROR 케이스에서 처리
          error => {
            // 타임 아웃으로 인한 에러일 경우
            if (error.url == null) {
              result.error('TIMEOUT');
              return;
            }
            try {
              let params = (new URL(error.url)).searchParams;
              let oauth_verifier = params.get("oauth_verifier");
              let oauth_token = params.get("oauth_token");
              if (oauth_verifier == null) {
                result.error(error);
              }
              else {
                var last_body = new FormData();
                last_body.append('oauth_token', oauth_token);
                last_body.append('oauth_verifier', oauth_verifier);
                this.http.post("https://api.cloudike.kr/api/1/accounts/oauth_confirm/", last_body).subscribe(data3 => {
                  result.next(data3);
                }, () => {
                  result.error('CanNotInfo');
                }
                );
              }
            } catch (error) {
              result.error('URLParsingError');
              return;
            }

          });
    }, (error) => // 인증 URL을 발급받지 못한경우
      {
        result.error(error.name);
      });

    result.AddMessage(this.toastr, "로그인 성공",
      {
        'TIMEOUT': "oauth_verifier Redirect 에러입니다. 다시 한번 시도해주세요.",
        'URLParsingError': "로그인 토큰을 분석하는 중 에러가 발생했습니다.",
        'CanNotInfo': "로그인은 성공했으나 사용자 정보를 얻어올 수 없습니다",
        'HttpErrorResponse': "인터넷 연결을 확인해주세요.",
        'Unauthorized': "이메일/비밀번호가 올바르지 않습니다.",
        'LastAttempt': "이메일이나 비밀번호가 올바르지 않습니다. 다시 틀릴 경우 차단 됩니다!",
        'UserTemporarilyLocked': "로그인 실패 10회로 사용자가 일시적으로 사용 정지 상태입니다. 30분 후 다시 시도하세요."
      }
    );
    return result;
  }

  public CreateFolder(path: string, name?: string): CloudikeApiResult {
    path = this.combine_path_folder(path, name);

    var formdata = new FormData();
    formdata.append("path", path);
    var result = new CloudikeApiResult(
      this.hs.post("https://api.cloudike.kr/api/1/fileops/folder_create/", formdata, this.task_name("폴더 생성", path))
    );
    result.AddMessage(this.toastr, "폴더가 생성되었습니다.",
      { "FolderAlreadyCreated": "같은 이름이 존재합니다." }
    );
    this.AddRevert(result, () => {
      return this.Delete(path);
    });
    return result;
  }

  public Rename(item_or_path: string | FileItem, new_name: string): CloudikeApiResult {
    var path = this.get_path_from_value(item_or_path);

    path = this.CleanPath(path);
    var formdata = new FormData();
    formdata.append("path", path);
    formdata.set("newname", new_name);
    var result = new CloudikeApiResult(
      this.hs.post("https://api.cloudike.kr/api/1/fileops/rename/", formdata, this.task_name("이름 변경", path))
    );
    result.AddMessage(this.toastr, "이름이 변경되었습니다.",
      { "FileCantBeRenamed": "이름을 변경할 수 없습니다." }
    );
    this.AddRevert(result, () => {
      var new_path = this.combine_path_folder(this.get_parent_folder(path), new_name);
      return this.Rename(new_path,this.get_file_name(path));
    });
    return result;
  }
  public Delete(item_or_path: string | FileItem): CloudikeApiResult {
    var path = this.get_path_from_value(item_or_path);
    var formdata = new FormData();
    formdata.append("path", path);
    var result = new CloudikeApiResult(
      this.hs.post("https://api.cloudike.kr/api/1/fileops/multi/delete/", formdata, this.task_name("삭제", path))
    );
    result.AddMessage(this.toastr, "삭제가 완료되었습니다.");
    return result;
  }

  public MultiDelete(paths: string[]): CloudikeApiResult {
    var formdata = new FormData();
    paths.forEach(path => {
      formdata.append("path", this.CleanPath(path));
    });

    var result = new CloudikeApiResult(
      this.hs.post("https://api.cloudike.kr/api/1/fileops/multi/delete/", formdata, this.task_name("대량 삭제"))
    );
    result.AddMessage(this.toastr, paths.length + "건의 삭제가 완료되었습니다.");
    return result;
  }

  public Move(from_item_or_path: string | FileItem, to_item_or_path: string | FileItem): CloudikeApiResult {

    var from = this.get_path_from_value(from_item_or_path);
    var to = this.get_path_from_value(to_item_or_path);

    var formdata = new FormData();
    formdata.set("from_path", from);
    formdata.set("to_path", to);
    var result = new CloudikeApiResult(
      this.hs.post("https://api.cloudike.kr/api/1/fileops/move/", formdata, this.task_name("파일 이동", from))
    );
    result.AddMessage(this.toastr, "이동이 완료되었습니다.");
    this.AddRevert(result, () => {
      // 현재 폴더 위치
      var new_path = this.combine_path_folder(to, this.get_file_name(from));
      var old_path = this.get_parent_folder(from);
      return this.Move(new_path,old_path);
    });
    return result;
  }

  public Copy(from_item_or_path: string | FileItem, to_item_or_path: string | FileItem): CloudikeApiResult {

    var from = this.get_path_from_value(from_item_or_path);
    var to = this.get_path_from_value(to_item_or_path);

    var formdata = new FormData();
    formdata.set("from_path", from);
    formdata.set("to_path", to);
    var result = new CloudikeApiResult(
      this.hs.post("https://api.cloudike.kr/api/1/fileops/copy/", formdata, this.task_name("파일 복사", from))
    );
    result.AddMessage(this.toastr, "복사가 완료되었습니다.");
    this.AddRevert(result, () => {
      // 현재 폴더 위치
      var new_path = this.combine_path_folder(to, this.get_file_name(from));
      return this.Delete(new_path);
    });
    return result;
  }

  public GetSharedLinkOption(item: FileItem) {
    var result = new CloudikeApiResult(
      this.hs.get("https://api.cloudike.kr/api/1/links/info/" + item.public_hash + '/', this.task_name("링크 옵션 읽어오기", item.name))
    );
    result.AddMessage(this.toastr, "공유 링크 설정을 읽었습니다.");
    return result;
  }

  public CreateSharedLink(item_or_path: string | FileItem, option?: CloudLinkOption) {
    var path = this.get_path_from_value(item_or_path);
    var formdata = new FormData();
    formdata.set("path", path);

    if (option.only_upload != null)
      formdata.set("upload_folder", 'true');

    if (option.password != null)
      formdata.set("password", option.password);

    if (option.date != null) {
      var ttl: number = option.date.getTime() - new Date().getTime();
      formdata.set("ttl", (ttl / 1000 + 60).toFixed(0));
    }

    if (option.download_max != null)
      formdata.set("download_max", option.download_max.toString());

    var result = new CloudikeApiResult(
      this.hs.post("https://api.cloudike.kr/api/1/links/create/", formdata, this.task_name("공유링크 생성", path))
    );
    result.AddMessage(this.toastr, "공유 링크가 생성되었습니다");
    return result;
  }

  public RemoveSharedLink(item_or_path: string | FileItem): CloudikeApiResult {
    var path = this.get_path_from_value(item_or_path);

    var formdata = new FormData();
    formdata.set("path", path);

    var result = new CloudikeApiResult(
      this.hs.post("https://api.cloudike.kr/api/1/links/delete/", formdata, this.task_name("공유링크 삭제", path))
    );
    result.AddMessage(this.toastr, "공유 링크가 삭제되었습니다");
    return result;
  }
  public ChangeSharedLinkOption(item_or_path: string | FileItem, option?: CloudLinkOption) {
    var result = new CloudikeApiResult();

    var path = this.get_path_from_value(item_or_path);

    var delete_event = this.RemoveSharedLink(path);
    delete_event.unsubscribe();
    delete_event.subscribe((data) => {
      var create_event = this.CreateSharedLink(path, option);
      create_event.unsubscribe();
      create_event.subscribe((data) => {
        result.next(data);
      }, (error) => {
        result.error(error);
      });

    }, (error) => {
      result.error("error");
    });
    result.AddMessage(this.toastr, "공유 링크 옵션이 변경되었습니다", {
      "InvalidParameters": "파라미터가 올바르지 않습니다. (링크 삭제됨)"
    }
    );
    return result;
  }

  public GetFavoritesList(valueStorage: ValueStorageService): {} {
    return valueStorage.GetValues(
      "favoriteList_Files",
      item => {
        return item.key.indexOf("?favorite") > 0 && item.value['value'] == true;
      },
      item => {
        var folder = FileItem.SplitPath(item.key);
        var file = new FileItem(null);
        file.path = folder[folder.length - 1].path;
        file.name = folder[folder.length - 1].name;
        file.isfolder = item.value['isfolder'];
        file.type = item.value['type'];
        file.date = ConvertFormat.unixToDate(item.value["date"]);
        return { key: file.name, value: file };
      }
      , true);
  }

  public GetFavoriteOfItem(valueStorage: ValueStorageService, item_or_path: string | FileItem): Boolean {
    var path = this.get_path_from_value(item_or_path);
    var data = valueStorage.GetToJson(path + '?favorite');
    return data != null && data['value'];
  }

  public SetFavoriteOfItem(valueStorage: ValueStorageService, item_or_path: string | FileItem, value: boolean) {
    var path = this.get_path_from_value(item_or_path);
    if (value == true) {
      FileManagement.getItem(this.hs, path, (item: FileItem) => {
        var json = {
          value: value,
          date: new Date().getTime(),
          isfolder: item.isfolder,
          type: item.type
        }
        valueStorage.Set(path + '?favorite', json);
      }, true);
    } else {
      valueStorage.Set(path + '?favorite', { value: false });
    }

  }

  public Revert() {
    if (this.lastAction == null) {
      this.toastr.error("최근에 수행된 작업이 없습니다.");
    }
    else {
      var result = this.lastAction();
      this.lastAction = null;
      this._revertMessage = null;
      result.unsubscribe();
      result.AddMessage(this.toastr, "최근 작업을 되돌렸습니다.");
    }
  }
  public GetFileList_Not_Implement(item_or_path: string | FileItem, limit = 500, offset = 0, order_by = 'name') {

  }
}

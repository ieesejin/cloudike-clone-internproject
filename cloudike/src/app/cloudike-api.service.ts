import { Injectable } from '@angular/core';
import { HTTPService } from './httpservice.service';
import { FileItem } from './drive/FileItem';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CloudikeApiReturn as CloudikeApiReturn } from './cloudike-api.result';

@Injectable({
  providedIn: 'root'
})
export class CloudikeApiService {

  constructor(private hs: HTTPService, private router: Router, private toastr: ToastrService) {
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

  private get_path_from_value(item_or_path : string | FileItem)
  {
    var path;
    if (item_or_path instanceof FileItem)
      path = item_or_path.path;
    else
      path = item_or_path;
    return this.CleanPath(path);
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

  public CreateFolder(path: string, name?: string): CloudikeApiReturn {
    path = this.combine_path_folder(path, name);

    var formdata = new FormData();
    formdata.append("path", path);
    var result = new CloudikeApiReturn(
      this.hs.post("https://api.cloudike.kr/api/1/fileops/folder_create/", formdata, this.task_name("폴더 생성", path))
    );
    result.AddMessage(this.toastr, "폴더가 생성되었습니다.",
      { "FolderAlreadyCreated": "같은 이름이 존재합니다." }
    );
    return result;
  }

  public Rename(item_or_path: string | FileItem, new_name: string): CloudikeApiReturn {
    var path = this.get_path_from_value(item_or_path);

    path = this.CleanPath(path);
    var formdata = new FormData();
    formdata.append("path", path);
    formdata.set("newname", new_name);
    var result = new CloudikeApiReturn(
      this.hs.post("https://api.cloudike.kr/api/1/fileops/rename/", formdata, this.task_name("이름 변경", path))
    );
    result.AddMessage(this.toastr, "이름이 변경되었습니다.",
      { "FileCantBeRenamed": "이름을 변경할 수 없습니다." }
    );
    return result;
  }
  public Delete(item_or_path: string | FileItem): CloudikeApiReturn {
    var path = this.get_path_from_value(item_or_path);
    var formdata = new FormData();
    formdata.append("path", path);
    var result = new CloudikeApiReturn(
      this.hs.post("https://api.cloudike.kr/api/1/fileops/multi/delete/", formdata, this.task_name("삭제", path))
    );
    result.AddMessage(this.toastr, "삭제가 완료되었습니다.");
    return result;
  }

  public MultiDelete(paths: string[]): CloudikeApiReturn {
    var formdata = new FormData();
    paths.forEach(path => {
      formdata.append("path", this.CleanPath(path));
    });

    var result = new CloudikeApiReturn(
      this.hs.post("https://api.cloudike.kr/api/1/fileops/multi/delete/", formdata, this.task_name("대량 삭제"))
    );
    result.AddMessage(this.toastr, paths.length + "건의 삭제가 완료되었습니다.");
    return result;
  }

  public Move(from_item_or_path: string | FileItem, to_item_or_path: string | FileItem): CloudikeApiReturn  {

    var from = this.get_path_from_value(from_item_or_path);
    var to = this.get_path_from_value(to_item_or_path);

    var formdata = new FormData();
        formdata.set("from_path",from);
        formdata.set("to_path",to);
    var result = new CloudikeApiReturn(
      this.hs.post("https://api.cloudike.kr/api/1/fileops/move/", formdata, this.task_name("파일 이동", from))
    );
    result.AddMessage(this.toastr, "이동이 완료되었습니다.");
    return result;
  }
  public Copy(from_item_or_path: string | FileItem, to_item_or_path: string | FileItem): CloudikeApiReturn  {

    var from = this.get_path_from_value(from_item_or_path);
    var to = this.get_path_from_value(to_item_or_path);

    var formdata = new FormData();
        formdata.set("from_path",from);
        formdata.set("to_path",to);
    var result = new CloudikeApiReturn(
      this.hs.post("https://api.cloudike.kr/api/1/fileops/copy/", formdata, this.task_name("파일 복사", from))
    );
    result.AddMessage(this.toastr, "복사가 완료되었습니다.");
    return result;
  }

  public GetFileList_Not_Implement(item_or_path: string | FileItem, limit = 500, offset=0, order_by='name')  
  {

  }
}

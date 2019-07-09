import { FileItem } from './FileItem';

import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../UserInfo';
export class FileManagement
{
    private static cache = {};
    private static http : HttpClient;
    public static getItem(http: HttpClient, url : string, func)
    {
        this.http = http;

        var folder = FileItem.SplitPath(url);

        // 먼저 해당 아이템을 직접 로드한 적이 있는지 확인
        let item = FileManagement.cache[folder[folder.length - 1].path];
        if (item != undefined)
        {
            func(item);
            return;
        }
        // 상위 폴더가 존재하지 않는 경우
        if (folder.length < 2)
        {
            FileManagement.reload(url, func);
            return;
        }
        // 그렇지 않을경우 상위 폴더에서 이 아이템이 로드된 적 있는지 확인
        let parent : FileItem = FileManagement.cache[folder[folder.length - 2].path];
        if (item == undefined)
        {
            FileManagement.reload(url, func);
            return;
        }
        let this_item : FileItem = parent.content[folder[folder.length - 1].name];
        if (this_item == undefined)
        {
            FileManagement.reload(url, func);
            return;
        }
        if (this_item.isfolder)
        {
            FileManagement.reload(url, func);
            return;
        }
        else
        {
            func(this_item);
        }
    }
    private static reload(url:string, func)
    {
        this.http.get("https://api.cloudike.kr/api/1/metadata/" + url + "?limit=500&offset=0&order_by=name",{
        headers: {'Mountbit-Auth':UserInfo.token()}
      }).subscribe(data => {
            var Now = new FileItem(data);
            FileManagement.cache[Now.path] = Now;
            func(Now);

      });

    }
}
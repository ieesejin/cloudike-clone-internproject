import { FileItem } from './FileItem';

import { HttpClient } from '@angular/common/http';
import { UserInfo } from '../UserInfo';
export class FileManagement
{
    private static read_waiting_queue = {};

    private static cache = {};
    private static http : HttpClient;
    public static getItem(http: HttpClient, path : string, func)
    {
        this.http = http;

        var folder = FileItem.SplitPath(path);

        // URL을 표준에 맞게 다시 작성
        path = folder[folder.length - 1].path;

        // 먼저 해당 아이템을 로드한 적이 있는지 확인
        let item = FileManagement.cache[path];
        if (item != undefined)
        {
            // 로드한 적이 있으면 바로 성공 이벤트 실행 후 종료 
            func(item);
            return;
        }
        // 상위 폴더가 존재하지 않는 경우 바로 종료
        if (folder.length < 2)
        {
            FileManagement.reload(path, func);
            return;
        }
        // 그렇지 않을경우 상위 폴더에서 이 아이템이 로드된 적 있는지 확인
        let parent : FileItem = FileManagement.cache[folder[folder.length - 2].path];
        if (item == undefined) // 로드된적 없으면
        {
            FileManagement.reload(path, func);
            return;
        }

        // 상위 폴더에서 해당 아이템을 검색
        let this_item : FileItem = parent.content[folder[folder.length - 1].name];
        if (this_item == undefined) // 해당 아이템이 없을 경우 요청
        {
            FileManagement.reload(path, func);
            return;
        }
        if (this_item.isfolder) // 해당 아이템이 폴더일 경우 (상세 정보를 얻기 위해 URL으로 요청)
        {
            FileManagement.reload(path, func);
            return;
        }
        else
        {
            // 해당 아이템이 파일 형식일 경우 바로 성공 이벤트 실행
            func(this_item);
        }
    }
    private static reload(path:string, func)
    {
        var url = encodeURI(path);
        // 동시에 같은 URL로 HTTP 리퀘스트를 보낸 경우
        if (FileManagement.read_waiting_queue[url] != undefined)
        {
            // 해당 이벤트를 기존 HTTP 리퀘스트 완료 이벤트에 등록한다.
            FileManagement.read_waiting_queue[url].push(func);
        }
        else  // 새로운 요청인 경우
        {
            // 다른 곳에서 요청이 올 수 있으니 배열을 만들어 현재 이벤트를 담아둔다.
            FileManagement.read_waiting_queue[url] = [func];

            // HTTP 요청
            this.http.get("https://api.cloudike.kr/api/1/metadata" + url + "?limit=500&offset=0&order_by=name",{
                headers: {'Mountbit-Auth':UserInfo.token}
            }).subscribe(data => {
                // 성공한경우 해당 파일을 만들고 캐시에 저장
                var Now = new FileItem(data);
                FileManagement.cache[Now.path] = Now;

                // 해당 URL에 등록된 이벤트를 모두 실행
                FileManagement.read_waiting_queue[url].forEach(event => {
                    event(Now);
                });

                // 해당 URL 오브젝트 초기화
                FileManagement.read_waiting_queue[url] = undefined;
            });
        }

    }

    public static posixToDate(posix:number) : string {
        
        return
    }
}
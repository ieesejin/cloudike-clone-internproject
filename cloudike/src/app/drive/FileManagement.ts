import { FileItem } from './FileItem';

import { UserInfo } from '../UserInfo';
import { HTTPService } from '../httpservice.service';
export class FileManagement
{
    private static read_waiting_queue = {};

    private static cache = {};
    private static hs : HTTPService;

    public static clean()
    {
        this.cache = {};
        this.read_waiting_queue = {};
    }

    public static getItem(hs: HTTPService, path : string, func, onlyinfo = false)
    {
        this.hs = hs;

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
        
        if (parent == undefined) // 로드된적 없으면
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

        if (onlyinfo == false && this_item.isfolder) // 해당 아이템이 폴더일 경우 (상세 정보를 얻기 위해 URL으로 요청)
        {
            FileManagement.reload(path, func);
            return;
        }
        else
        {
            // 해당 아이템이 파일 형식일 경우, 또는 info만 요청하는 경우는 바로 성공 이벤트 실행
            func(this_item);
        }
    }

    public static link_set(path : string, hash : string)
    {
        var folder = null;
        var parent_path = null;
        var name = null;
        folder = FileItem.SplitPath(path);
        path = folder[folder.length - 1].path;
        name = folder[folder.length - 1].name;
        parent_path = folder[folder.length - 2].path;
        if (!FileManagement.contains(parent_path)) return;
        var item : FileItem = FileManagement.cache[parent_path]["content"][name];
        item.public_hash = hash;
        // 폴더일 경우
        if (item.isfolder)
        {
            // 실제 경로도 확인
            if (FileManagement.cache[path] != undefined)
                FileManagement.cache[path].public_hash = hash;
        }
    }
    public static removeItem(path : string)
    {
        var folder = null;
        var parent_path = null;
        var name = null;
        folder = FileItem.SplitPath(path);
        path = folder[folder.length - 1].path;
        name = folder[folder.length - 1].name;
        parent_path = folder[folder.length - 2].path;

        if (!FileManagement.contains(parent_path)) return;

        var item : FileItem = FileManagement.cache[parent_path]["content"][name];

        if (item.isfolder)
        {
            /* 기존 캐시에 바뀌기 전 경로로 되어있는 폴더를 모두 삭제 */
            Object.keys(FileManagement.cache).forEach(function(key){
                var temp_item = FileManagement.cache[key];
                if (key.indexOf(path) == 0)
                {
                    delete FileManagement.cache[key];
                }
            });
        }
        delete FileManagement.cache[parent_path]["content"][name];
    }

    public static rename(old_path: string, path: string)
    {
        var old_folder = FileItem.SplitPath(old_path);
        var folder = FileItem.SplitPath(path);


        old_path = old_folder[old_folder.length - 1].path;
        var old_name = old_folder[old_folder.length - 1].name;
        var old_parent_path = old_folder[old_folder.length - 2].path;

        if (!FileManagement.contains(old_parent_path)) return;

        var item : FileItem = FileManagement.cache[old_parent_path]["content"][old_name];

        path = folder[folder.length - 1].path;
        var name = folder[folder.length - 1].name;
        var parent_path = folder[folder.length - 2].path;
        
        item.path = path;
        item.name = name;

        if (FileManagement.contains(parent_path))
        {
            FileManagement.cache[parent_path]["content"][name] = item;
        }
            
        /* 하위 폴더 변경 이슈
        if (FileManagement.contains(old_path))
        {
            console.log("캐시 " + path + "에 아이템 추가");
            FileManagement.cache[path] = FileManagement.cache[old_path];
            console.log(FileManagement.cache[path]);
            FileManagement.cache[path].name = name;
            FileManagement.cache[path].path = path;

            console.log(FileManagement.cache[path]);
        }
        */

        FileManagement.removeItem(old_path);
    }

    public static contains(path : string)
    {
        var folder = FileItem.SplitPath(path);

        // URL을 표준에 맞게 다시 작성
        path = folder[folder.length - 1].path;

        return FileManagement.cache[path] != null;
    }


    public static getSelectItemPath() : string[]
    {
        var result = [];
        var list= document.getElementsByName("chk_info");
        list.forEach((element : HTMLInputElement) => {
            if(element.checked){
                result.push(element.value);
            }
        });
        return result;
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
            this.hs.get("https://api.cloudike.kr/api/1/metadata" + url + "?limit=500&offset=0&order_by=name", url + " 읽어오기").subscribe(data => {
                // 성공한경우 해당 파일을 만들고 캐시에 저장
                var Now = new FileItem(data);
                FileManagement.cache[Now.path] = Now;

                // 해당 URL에 등록된 이벤트를 모두 실행
                FileManagement.read_waiting_queue[url].forEach(event => {
                    event(Now);
                });

                // 해당 URL 오브젝트 초기화
                delete FileManagement.read_waiting_queue[url];
            },
            error =>
            {
                delete FileManagement.read_waiting_queue[url];
            });
        }

    }
}
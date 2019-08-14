import { ConvertFormat } from './ConvertFormat'
import { HTTPService } from '../service/HttpService/httpservice.service';


export class FileItem
{
    public content = {};
    public author_name: string;
    public icon: string;
    public extraData = {};
    public path: string;
    public bytes : number;
    public bytesString : string;
    public name: string;
    public owner_path: string;
    public mime_type: string;
    public type: string;
    public modified: number;
    public date: string;
    public role: string;
    public isfolder: boolean;
    public isShared: boolean;
    public isRead = false;
    public public_hash = null; // 공유링크 해시
    constructor(value)
    {
        if (value == null) 
        {
            this.type = "cache";
            this.isfolder = true;
            return;
        }
        
        this.icon = value["icon"];
        this.path = value["path"];
        if (value["restore_path"] != undefined)
        {
            this.path = value['restore_path'];
        }
        this.mime_type = value["mime_type"];
        this.type = this.icon;
        this.isShared = value["shared"];
        if (value['type'] == "file_created" || value['type'] == "file_new_content" || value['type'] == "file_copied")
        {
            this.bytes = value["content"]["size"];
            this.modified = value["content"]["modified"];
        }
        else if (value['type'] == "folder_created" || value['type'] == "folder_copied")
        {
            this.role = "owner";
            this.modified = value["content"]["modified"];
        }
        else
        {
            if (value["public_hash"] != null && value["public_hash"] != "")
            {
                this.public_hash = value["public_hash"];
            }
            if (value['extradata'] != null)
            {
                var temp = value['extradata']['thumbnails'];
                if (temp != null && temp['status'] == 'ready')
                {
                    this.extraData['small'] = temp['small']['link'];
                    this.extraData['middle'] = temp['middle']['link'];
                }
                var temp = value['extradata']['pdf'];
                if (temp != null && temp['status'] == 'ready')
                {
                    this.extraData['pdf'] = temp;
                }
            }
            this.bytes = value["bytes"];
            this.owner_path = value["owner_path"];
            
            this.modified = value["modified"];
            this.role = value["role"];

            if (value["content"] != null)
            {
                // => 을 functuin(subvalue) { 으로  대체할경우 this 오류 발생
                value["content"].forEach( (subvalue) => {
                   
                    let item = new FileItem(subvalue);
                    this.content[item.name] = item;
                }); 
            }
        }
        this.date = ConvertFormat.unixToDate(this.modified);

        if (this.path == "/")
        {
            this.name = "Cloudike";
        }
        else if (value['name'] != undefined)
        {
            this.name = value['name'];
        }
        else if (this.path != undefined)
        {
            let temp = this.path.split("/");
            this.name = temp[temp.length - 1];
        }

        if (this.type == "ebook_adobe") this.type = "PDF";
        if (this.type == "presentation_office") this.type = "Powerpoint";
        if (this.type == "document_office") this.type = "Word";
        if (this.type == "video") this.type = "비디오";
        if (this.type == "archive") this.type = "압축 파일";
        if (this.type == "document_text") this.type = "텍스트";
        if (this.type == "image") this.type = "이미지";
        if (this.type == "unknown")
        {
            if (this.mime_type == "application/octet-stream") this.type = "문서"; // 해당 확장자 .md .yml .gitignore
        }
        if (this.type == "")
        {
            if (this.mime_type == "application/json") this.type = "문서"; // 해당 확장자 .json
        }
        if (this.type == "folder") 
        {
            this.isfolder = true;
            if (this.role == "collaborator" && this.isShared == true)
                this.type = "공유 폴더";
            else
                this.type = "폴더";
        }
        else
        {
            if (this.bytes != null)
                this.bytesString = ConvertFormat.byteToString(this.bytes);
            this.isfolder = false;
        }

    }

    public Download(hs: HTTPService)
    {
        if (this.isfolder)
        {
            var formdata = new FormData();
            formdata.set("path", this.path);
            formdata.set("is_win", "true");
            // 폴더 다운로드
            hs.post("https://api.cloudike.kr/api/1/files/create_link_of_archive/",formdata, this.name + " 압축 다운로드").subscribe(data => {
            window.location.replace("https://api.cloudike.kr/api/1/files/download_as_archive_stream/" + data["hash"] + "/");
            });
        }
        else
        {
            // 파일 다운로드
            hs.get("https://api.cloudike.kr/api/1/files/get" + this.path, this.name + " 다운로드").subscribe(data => {
                window.location = data["url"];
            });
        }
    }

    public get length()
    {
        return Object.keys(this.content).length;
    }

    public static SplitPath(path)
    {
        let result = [];

        // 물음표 뒷부분 삭제
        path = path.split('?')[0];
        
        //      /폴더명/폴더2   이런식으로 형태 맞추기
        if (path[0] != '/') path = '/' + path;
        let folder = path.split('/');
        folder[0] = "내 Cloudike";

        //     /            "", ""
        //     /폴더        "", "폴더"

        let full_path = "/"; // 기본값은 / 절대 경로로 시작 
        for (var i = 0 ; i < folder.length; i++)
        {
            if (i != 0 && folder[i] == "")
            {
                continue;
            }
            // 절대 경로에 있는 상위 폴더까지는 앞에 /가 하나 뿐임.
            if (i > 1) full_path += '/'; 

            if (i != 0)
                full_path += folder[i];
            result.push({
                name: folder[i],
                path: full_path
            })

        }
        return result;
    }
}
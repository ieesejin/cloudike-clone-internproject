import { FileManagement } from './FileManagement';


export class FileItem
{
    public content_hide = true;
    public content = {};
    public author_name: string;
    public icon: string;
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
    public isRead = false;
    constructor(value)
    {
        if (value == null) 
        {
            this.type = "cache";
            this.isfolder = true;
            return;
        }
        this.author_name = value["author_name"];
        this.icon = value["icon"];
        this.path = value["path"];
        this.bytes = value["bytes"];
        this.owner_path = value["owner_path"];
        this.mime_type = value["mime_type"];
        
        this.modified = value["modified"];
        this.date = FileManagement.unixToDate(this.modified)
        this.role = value["role"];

        this.type = this.icon;
        if (this.type == "presentation_office") this.type = "Powerpoint"
        if (this.type == "document_office") this.type = "Word"
        if (this.type == "folder") 
        {
            this.isfolder = true;
            if (this.role == "collaborator")
                this.type = "공유 폴더";
            else if (this.role == "owner")
                this.type = "폴더";
            else
                this.type = "알 수 없음 .. 폴더";
        }
        else
        {
            this.bytesString = FileManagement.byteToString(this.bytes);
            this.isfolder = false;
        }
        if (this.path == "/")
        {
            this.name = "Cloudike";
        }
        else
        {
            let temp = this.path.split("/");
            this.name = temp[temp.length - 1];
        }
        

        if (value["content"] != null)
        {
            // => 을 functuin(subvalue) { 으로  대체할경우 this 오류 발생
            value["content"].forEach( (subvalue) => {
                let item = new FileItem(subvalue);
                this.content[item.name] = item;
            }); 
        }
    }


    public static SplitPath(path)
    {
        let result = [];
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
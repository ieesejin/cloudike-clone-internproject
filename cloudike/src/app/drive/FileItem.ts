
export class FileItem
{
    public content = {};
    public author_name: string;
    public icon: string;
    public path: string;
    public bytes : number;
    public name: string;
    public owner_path: string;
    public mime_type: string;
    public type: string;
    public modified: string;
    public role: string;
    public isfolder: boolean;
    constructor(value)
    {
        if (value == null) return null;
        this.author_name = value["author_name"];
        this.icon = value["icon"];
        this.path = value["path"];
        this.bytes = value["bytes"];
        this.owner_path = value["owner_path"];
        this.mime_type = value["mime_type"];
        
        this.modified = value["modified"];
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
    
    public isNull() : boolean
    {
        if (this.path == null)
            return true;
        else
            return false;
    }

    public static UpdateRoot(root : FileItem, value : FileItem) : FileItem
    {
        if (value.path == "/")
        {
            return value;
        }
        if (root.isNull())
        {
            return FileItem.CreateRoot(value);
        }
        let move = root;
        let paths = FileItem.SplitPath(value.path);
        paths.pop();

        for(let i = 1; i < paths.length; i++)
        {
            move = move.content[paths[i].name];
        }
        move.content[value.name] = value;
        return root;
    }

    public static CreateRoot(value : FileItem) : FileItem
    {
        let paths = FileItem.SplitPath(value.path).reverse();
        paths.pop(); // 가장 마지막은 value와 같은 아이템. 즉 이미 존재하므로 의미 없음. (pop으로 삭제)
        
        var result = null;
        paths.forEach(element => {

            let temp = new FileItem(null);
            temp.path = element.path;
            temp.type = "folder";
            temp.isfolder = true;
            temp.name = element.name;
            if (result != null)
                temp.content[result.name] = result;
            else
                temp.content[value.name] = value;
            result = temp;

        });
        result.name = "Cloudike";
        return result;
    }

    public static SplitPath(path)
    {
        let result = [];
        if (path[0] != '/') path = '/' + path;
        let folder = path.split('/');

        let full_path = "/"; // 기본값은 / 절대 경로로 시작 
        for (var i = 0 ; i < folder.length; i++)
        {
            if (i != 0 && folder[i] == "")
            {
                continue;
            }
            // 절대 경로에 있는 상위 폴더까지는 앞에 /가 하나 뿐임.
            if (i > 1) full_path += '/'; 

            full_path += folder[i];
            result.push({
                name: folder[i],
                path: full_path
            })

        }
        return result;
    }
}
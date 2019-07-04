
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
        let temp = this.path.split("/");
        this.name = temp[temp.length - 1];

        if (value["content"] != null)
        {
            // => 을 functuin(subvalue) { 으로  대체할경우 this 오류 발생
            value["content"].forEach( (subvalue) => {
                let item = new FileItem(subvalue);
                this.content[item.name] = item;
            }); 
        }
    }
    public static Update(root : FileItem, value : FileItem) : FileItem
    {
        if (root.isNull())
        {
          return FileItem.Init(value);
        }
        let move = root;
        if (value.path == "/")
        {
            return value;
        }
        let parent = value.path;
        parent = parent.substring(0,parent.lastIndexOf("/"));

        if (parent != "")
        {
            let folder = parent.substring(1).split("/");
            for(let i = 0; i < folder.length;i++)
            {
                move = move.content[folder[i]];
            }
        }
        move.content[value.name] = value;
        return value;
    }
    public static Init(value : FileItem) : FileItem
    {
        if (value.path == "/")
        {
            return value;
        }
        let folder = value.path.split("/");
        let result = null;
        for(var i = folder.length - 2; i >= 0;i--)
        {
            let path = "";
            for(var j = 0; j <= i; j++)
            {
                path += folder[j] + "/";
            }
            var a = new FileItem(null);
            if (i == folder.length - 2)
            {
                a.content[value.name] = value;
            }
            a.path = path;
            a.type = "folder";
            a.isfolder = true;
            a.name = folder[i];
            if (result != null)
            {
                a.content[result.name] = result;
            }
            result = a;
        }
        return result;
    }
    public isNull() : boolean
    {
        if (this.path == null)
            return true;
        else
            return false;
    }
}
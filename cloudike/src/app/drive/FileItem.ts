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
            if (this.role == "collaborator")
                this.type = "공유 폴더";
            else if (this.role == "owner")
                this.type = "폴더";
            else
                this.type = "알 수 없음 .. 폴더";
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
}
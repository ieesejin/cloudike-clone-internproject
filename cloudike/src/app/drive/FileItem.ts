export class FileItem
{
    public content = {};
    public author_name: string;
    public icon: string;
    public path: string;
    public bytes : number;
    public name: string;
    constructor(value)
    {
        this.author_name = value["author_name"];
        this.icon = value["icon"];
        this.path = value["path"];
        this.bytes = value["bytes"];

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
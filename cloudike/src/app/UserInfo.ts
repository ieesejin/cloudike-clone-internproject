
export class UserInfo 
{
    private static data = "";
    private static init() : boolean
    {
        if (UserInfo.data == "")
        {
            let value = localStorage.getItem("CLOUDIKE");
            if (value == "" || value == null)
                return true;
            UserInfo.data = JSON.parse(value);
        }
        return false;
    }
    public static user_name()
    {
        if (this.init()) return "";
        return this.data["name"];
    }
    public static token()
    {
        if (this.init()) return "";
        return this.data["token"];
    }
    public static Save(value)
    {
        localStorage.setItem("CLOUDIKE", JSON.stringify(value));
        this.data = value;
    }
    public static isLogin() : boolean
    {
        return this.token() != '';
    }
}
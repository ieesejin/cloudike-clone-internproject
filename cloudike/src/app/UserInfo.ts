import { HttpClient } from '@angular/common/http';

export class UserInfo 
{
    private static data = "";
    private static _storageSize : number = 0;
    private static _maxStorageSize : number = 0;
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
    public static get user_name()
    {
        if (this.init()) return "";
        return this.data["name"];
    }
    public static get company_id()
    {
        if (this.init()) return "";
        return this.data["company_id"];
    }
    public static get token()
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
        return this.token != '';
    }
    public static Logout()
    {
        this.data = "";
        localStorage.removeItem("CLOUDIKE");
    }
    public static Update(http: HttpClient)
    {
        http.get("https://api.cloudike.kr/api/1/accounts/get/",{
            headers: {'Mountbit-Auth':UserInfo.token}
            }).subscribe(data => {
            this._storageSize = data["storage_size"];
            this._maxStorageSize = data["quota_size"];
        });

        http.get("https://api.cloudike.kr/api/1/accounts/company/" + this.company_id + "/",{
            headers: {'Mountbit-Auth':UserInfo.token}
            }).subscribe(data => {
                //this._maxStorageSize = data["storage_size"];
        });
    }
    public static get storageSize()
    {
        return this._storageSize;
    }
    public static get maxStorageSize()
    {
        return this._maxStorageSize;
    }

    public static set storageSize(value :number)
    {
        this._storageSize = value;
    }
    public static set maxStorageSize(value :number)
    {
        this._maxStorageSize = value;
    }
}
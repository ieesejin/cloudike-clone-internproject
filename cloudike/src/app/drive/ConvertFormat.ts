export class ConvertFormat
{
    public static byteToString(byte:number) : string {
        var capacity:number = byte;
        var count:number = 0;
        for(count = 0; capacity >= 1024; count++){
            capacity = capacity/1024;
        }
        
        var result : string = capacity.toFixed(count > 0 ? 1 : 0);

        var format = ["B", "KB", "MB", "GB", "TB"];
        return result + ' ' + format[count];
    }
    
    public static unixToDate(time:number) : string {
        var date = new Date(time);
        var diffTime = (new Date().getTime() - date.getTime()) / 1000;

        switch(true) {
            case diffTime < 60:
                return "방금";
            case diffTime < 3600:
                return parseInt(String(diffTime/60)) + '분 전';
            case diffTime < 86400:
                return parseInt(String(diffTime/3600)) + '시간 전';
            case diffTime < 604800:
                return parseInt(String(diffTime/86400)) + '일 전';
            default:
                return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDay();
        }
    }

}
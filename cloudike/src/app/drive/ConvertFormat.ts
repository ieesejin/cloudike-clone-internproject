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
        var currentTime = new Date().getTime()/1000;
        console.log(currentTime);
        var inputTime = time/1000;
        console.log(inputTime);
        var diffTime = currentTime - inputTime;
        var postTime;
        switch(true) {
            case diffTime < 60:
                postTime = '방금';
                break;
            case diffTime < 3600:
                postTime = parseInt(String(diffTime/60)) + '분 전';
                break;
                
            case diffTime < 86400:
                postTime = parseInt(String(diffTime/3600)) + '시간 전';
                break;
                    
            case diffTime < 604800:
                postTime = parseInt(String(diffTime/86400)) + '일 전';
                break;
                    
            case diffTime >= 604800:
                var date = new Date(time*1000);
                postTime = date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate();
                break;
        }
        return postTime;
    }

}
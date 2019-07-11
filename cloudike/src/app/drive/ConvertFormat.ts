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
}
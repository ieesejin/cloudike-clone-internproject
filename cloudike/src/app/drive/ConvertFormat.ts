export class ConvertFormat
{
    //업로드 된 파일이나 폴더는 Byte로 되어 있어 KB, MB, GB, TB로 변환
    public static byteToString(byte:number) : string {
        //Byte 크기
        var capacity:number = byte;
        //몇번 변환이 이루어 지는지
        var count:number = 0;
        //1024로 몇번이 나누어 지는지 확인 -> 변환 횟수 확인
        for(count = 0; capacity >= 1024; count++){
            capacity = capacity/1024;
        }
        
        //변환이 이루어지지 않았다면 소숫점 없이 표현 Byte로 표현
        var result : string = capacity.toFixed(count > 0 ? 1 : 0);

        //변환이 이루어 졌으면 이루어진 만큼 해당 단위로 표현
        var format = ["B", "KB", "MB", "GB", "TB"];
        return result + ' ' + format[count];
    }
    
    //업로드 된 파일이나 폴더는 유닉스시간을 사용 유닉스 시간을 표준시간으로 표기하기 위한 함수
    public static unixToDate(time:number) : string {
        //파일이나 폴더가 업로드 된 시간과 현재 시간
        var date = new Date(time);
        var currentDate = new Date();

        //날짜가 바뀌면 월, 일, 시간을 표기 12시간 표기법으로 13시 부터는 1시로
        if(currentDate.getDate() != date.getDate()) {
            if(date.getHours() > 12) {
                return (date.getMonth() + 1) + "월 " + date.getDate() + "일, 오후 " + (date.getHours()-12) + ":" + date.getMinutes();
            }
            else {
                return (date.getMonth() + 1) + "월 " + date.getDate() + "일, 오전 " + (date.getHours()) + ":" + date.getMinutes();
            }
        }
        //해가 바뀌면 년, 월, 일을 표기
        else if (currentDate.getFullYear() != date.getFullYear()) {
            return date.getFullYear() + "년 " + (date.getMonth() + 1) + "월 " + date.getDate() + "일";
        }
        //업로드한 날에는 12시간제로 시간만 표기
        else {
            if(date.getHours() > 12) {
                return "오후 " + (date.getHours()-12) + ":" + date.getMinutes();
            }
            else {
                return "오전 " + (date.getHours()) + ":" + date.getMinutes();
            }
        }
    }
}

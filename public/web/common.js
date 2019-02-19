function GetUrlParam(paraName) 
{
    var url = document.location.toString();
    var arrObj = url.split("?");

    if (arrObj.length > 1) {
        var arrPara = arrObj[1].split("&");
        var arr;

        for (var i = 0; i < arrPara.length; i++) {
            arr = arrPara[i].split("=");

            if (arr != null && arr[0] == paraName) {
                return arr[1];
            }
        }
        return "";
    } else {
        return "";
    }
}


function getCookie(c_name)
{
    if (document.cookie.length>0)
    { 
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1)
        { 
            c_start = c_start + c_name.length+1 
            c_end = document.cookie.indexOf(";",c_start)
            if (c_end == -1) {
                c_end = document.cookie.length
            }
            return unescape(document.cookie.substring(c_start,c_end))
        } 
    }
    return ""
}

function setCookie(c_name,value)
{
    document.cookie=c_name+ "=" +escape(value)
}


function post(url,para,success,error) 
{
    $.ajax({
        async:false,
        type:"post",
        url:url,
        data:JSON.stringify(para),
        dataType:"json",
        contentType: "application/json; charset=utf-8",  
        success:success,
        error:error
    });
}





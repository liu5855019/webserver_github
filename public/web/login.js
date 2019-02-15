
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

function checkCookie()
{
    token = getCookie('dmtoken');
    if (token!=null && token!="") {
        window.location.href="./mdList";
    }
}




function clickLoginBtn() {
    
    username = document.getElementById("username").value;
    password = document.getElementById("password").value;
    
    para = {
        username:username,
        password:password
    }

    $.ajax({
        async:false,
        type:"post",
        url:"./user/login",
        data:JSON.stringify(para),
        dataType:"json",
        contentType: "application/json; charset=utf-8",  
        success:function(data){
            console.log(data);
            if (data.code != 200) {
                alert(data.msg);
                return;
            } 
            debugger;
            token = data.obj.token;
            setCookie("dmtoken",token);
            checkCookie();
        },
        error:function(data){
            alert(data.msg);
        }
    });
}

checkCookie();


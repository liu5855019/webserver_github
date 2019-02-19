


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


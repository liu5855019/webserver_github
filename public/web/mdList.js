
function getMarkdownList() {
    
    para = {
    }

    $.ajax({
        async:false,
        type:"post",
        url:"./doc/docList",
        data:JSON.stringify(para),
        dataType:"json",
        contentType: "application/json; charset=utf-8",  
        success:function(data){
            console.log(data);
            if (data.code != 200) {
                if (data.code == 401) {
                    logout();
                }
                alert(data.msg);
                return;
            } 
            showData(data.obj);
        },
        error:function(data){
            alert(data.msg);
        }
    });
}

function logout() 
{
    setCookie("dmtoken","");
    window.location.href="./login";
}

function clickLogoutBtn() 
{
    if (confirm("确定要退出吗?")) {
       logout();
    } else {
        
    }
}

function clickCreateBtn()
{
    var name = prompt("请输入文章标题","");

    if (name.length > 2) {
        createDoc(name);
    } else {
        alert("标题最少 3 个字");
    }
}

//展示数据
function showData(data) {
    var str = "";//定义用于拼接的字符串
    for (var i = 0; i < data.length ;i++) {
        let item = data[i];
        dateStr = dateFmt(new Date(item.create_time),"yyyy-MM-dd hh:mm");
        meStr = item.creater.length > 0 ? "我创建" : "其他人";
        editBtnStr = item.creater.length > 0 ? "<td><button name=\"" +item.guid+  "\"type=\"button\" onclick=\"clickEditBtn(this)\">Edit Power</button></td></tr>" : "</tr>";
        //拼接表格的行和列
        str = "<tr><td>" + item.title + "</td>" +
              "<td>" + dateStr + "</td>" + 
              "<td>" + meStr + "</td>" +
              "<td><button name=\"" +item.guid+  "\"type=\"button\" onclick=\"clickLookBtn(this)\">Look</button></td>" +
              editBtnStr;
        //追加到table中
        $("#tab").append(str);         
    }
}

function clickLookBtn(btn)
{
    console.log(btn.name);
    if (btn.name) {
        window.open("./markdown?guid="+btn.name);
    }
}

function clickEditBtn(btn)
{
    //<label><input name="apple" type="checkbox" value="aa" checked=true  />苹果</label>
    if (btn.name) {
        jQuery('.box').show();
     

        post("./doc/getPower",{doc_guid:btn.name},function (data) {
            if (data.code != 200) {
                if (data.code == 401) {
                    logout();
                }
                alert(data.msg);
                return;
            } 
            accountList = data.obj.accountList;
            docModel = data.obj.docModel;

            //未完待续

        },function (err) {

        });
    }
    

}

function checkForm(form)
{
    debugger;
    console.log(form);
    
}

function getPower(guid) {
    
}

function createDoc(title) {
    var para = {
        title : title
    }

    post("./doc/createDoc",para,function(data){
        if (data.code == 200) {
            history.go(0);
        } else {
            alert(data.msg);
        }
    },function(err){
        alert(err.msg);
    });
}


getMarkdownList();


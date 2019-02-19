
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



//展示数据
function showData(data) {
    var str = "";//定义用于拼接的字符串
    for (var i = 0; i < data.length ;i++) {
        let item = data[i];
        //拼接表格的行和列
        str = "<tr><td>" + item.title + "</td><td>" + new Date(item.create_time) + "</td><td><button name=\"" +item.guid+  "\"type=\"button\" onclick=\"clickLookBtn(this)\">Look</button></td></tr>";
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


function createDoc(title) {
    var para = {
        title : title
    }
    $.post("./doc/createDoc",para , function(data,status){
        console.log(data);
        console.log(status);
    });
}


getMarkdownList();


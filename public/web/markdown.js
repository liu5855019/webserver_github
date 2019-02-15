 //展示数据
function showData(data) {
    debugger;
    var str = "";//定义用于拼接的字符串
    for (var i = 0; i < 10 ;i++) {
        //拼接表格的行和列
        str = "<tr><td>" + i + "</td><td>" + i + "</td><td><button name=\"" +i+  "\"type=\"button\" onclick=\"clickLookBtn(this)\">Look</button></td></tr>";
        //追加到table中
        $("#tab").append(str);         
    }
}

function clickLookBtn(btn)
{
    console.log(btn.name);
    
}

showData("");


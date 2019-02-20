
var SocketType = {
    initSocket : "kInitSocket",
    initSocketSuccess : "kInitSocketSuccess",
    initSocketError : "kInitSocketError",
    updateDoc : "kUpdateDoc", 

}

class DocModel {
    constructor() {
        this.guid = "";
        this.title = "";
        this.account_guid = "";
        this.power = "";
        this.creater = "";
        this.create_time = 0;
    }
}

class DocContentModel {
    constructor() {
        this.guid = "";
        this.doc_guid = "";
        this.begin_line = 0;
        this.end_line = 0;
        this.content = "";
        this.creater = "";
        this.create_time = 0;
    }
}


var testEditor;
var wsServer = new WebSocket("ws://" + document.location.hostname + ":3001");
const k_doc_guid = GetUrlParam("guid");


let docInfo = new DocModel(); 
var docContents = [];  //DocContentModel[]
var docStrArr = [];
var lastResetStr = "";

$(function() {
    testEditor = editormd("test-editormd", {
        width   : "90%",
        height  : 640,
        syncScrolling : "single",
        path    : "../lib/editmd_lib/lib/",
        // theme: "dark",//工具栏主题
        // previewTheme: "dark",//预览主题
        // editorTheme: "pastel-on-dark",//编辑主题
        onchange : function() {
            //$("#output").html("onchange : this.id =>" + this.id + ", markdown =>" + this.getValue());
            //console.log("onchange:",this.getValue());
            compareContent();
        } , 
        onload : function() {
            //this.setMarkdown("i am onload");
            getDocInfo(k_doc_guid);
        } , 
    });
});

// 获取Doc信息
function getDocInfo(doc_guid) {
    var para = {
        doc_guid : doc_guid
    }

    post("./doc/docInfo",para,function(data){
        if (data.code != 200) {
            alert(data.msg);
            return;
        }

        obj = data.obj;
        doc = obj.doc;
        arr = obj.contents;
        
        //判断是否有权限修改
        userGuid = obj.user;
        var path = -1;
        if (doc.power && userGuid) {
            path = doc.power.indexOf(userGuid);
        }
        if (userGuid == doc.creater || path != -1) {

        } else {
            document.getElementById("state").innerHTML = "您不可以编辑此文件";
        }

        docInfo.create_time = doc.create_time;
        docInfo.creater = doc.creater;
        docInfo.guid = doc.guid;
        docInfo.power = doc.power;
        docInfo.title = doc.title;
        
        document.getElementById("title").innerHTML = doc.title;

        let tmpContents = [];
        for (let index = 0; index < arr.length; index++) {
            const item = arr[index];
            let docContent = new DocContentModel();
            docContent.guid = item.guid;
            docContent.doc_guid = item.doc_guid;
            docContent.begin_line = item.begin_line;
            docContent.end_line = item.end_line;
            docContent.content = item.content;
            docContent.create_time = item.create_time;
            docContent.creater = item.creater;
            tmpContents.push(docContent);
        }
        docContents = tmpContents;

        connectContent();
    },function(err){

    });

}

//将获取到的信息按规则链接成真正的doc
function connectContent() {
    var strArr = [];

    for (let index = 0; index < docContents.length; index++) {
        //debugger;
        const docContent = docContents[index];
        content = docContent.content;
        if (content!=null) {
            strArr.splice(docContent.begin_line,docContent.end_line,content);
        } else {
            strArr.splice(docContent.begin_line,docContent.end_line);
        }
        tmpStr = strArr.join("\n");
        strArr = tmpStr.split("\n");
    }

    console.log(strArr);

    docStrArr = strArr;
    lastResetStr = strArr.join("\n");
    testEditor.setMarkdown(lastResetStr);
}

//当内容发生改变,比较修改了什么,当达到一定条件后发送给后台
function compareContent() {
    str = testEditor.getValue();
    if (lastResetStr == str) {
        return;
    }

    strArr = str.split("\n");
    over_contents = str.split("\n");

    oldArr = docStrArr;
    begin_line = 0;
    end_line = 0;

    if (strArr.length != docStrArr.length) {
        //debugger;
        for (let index = 0; index < docStrArr.length; index++) {
            const oldStr = docStrArr[index];
            const newStr = strArr[index];
            if (oldStr != newStr) {
                begin_line = index;
                break;
            }
        }

        strArr.splice(0,begin_line);
        oldArr.splice(0,begin_line);

        for (let index = oldArr.length-1; index >= 0; index--) {
            const oldStr = oldArr[index];
            const newStr = strArr[strArr.length - 1];
            if (oldStr != newStr) {
                break;
            }
            strArr.pop();
            oldArr.pop();
        }

        end_line = oldArr.length

        content = null;
        if (strArr.length) {
            content = strArr.join("\n");
        }

        createContent(begin_line,end_line,content,over_contents);
    } else {
        document.getElementById("state").innerHTML = "未保存";
    }
}

// 向后台发送最新修改的内容
function createContent(begin_line,end_line,content,over_contents) {
    para = {
        doc_guid : k_doc_guid,
        begin_line : begin_line,
        end_line : end_line,
        content : content,
        count:docContents.length
    };
    console.log(para);
                 
    $.ajax({
        async:false,
        type:"post",
        url:"./doc/createContent",
        data:JSON.stringify(para),
        dataType:"json",
        contentType: "application/json; charset=utf-8",  
        success:function(data){
            console.log(data);
            if (data.code != 200) {
                alert(data.msg);
                if (data.code == 202) {
                    reloadContent();
                }
                return;
            } 
            docStrArr = over_contents;
            let docContent = new DocContentModel();
            docContent.doc_guid = k_doc_guid;
            docContent.begin_line = begin_line;
            docContent.end_line = end_line;
            docContent.content = content;
            docContents.push(docContent);
            console.log(over_contents);
            console.log("保存成功");
            document.getElementById("state").innerHTML = "已保存";
        },
        error:function(data){
            alert(data.msg);
        }
    });
}

function reloadContent() {
    post("./doc/contentList",{doc_guid:k_doc_guid},function (data){
        console.log(data);
        arr = data.obj;
        let tmpContents = [];
        for (let index = 0; index < arr.length; index++) {
            const item = arr[index];
            let docContent = new DocContentModel();
            docContent.guid = item.guid;
            docContent.doc_guid = item.doc_guid;
            docContent.begin_line = item.begin_line;
            docContent.end_line = item.end_line;
            docContent.content = item.content;
            docContent.create_time = item.create_time;
            docContent.creater = item.creater;
            tmpContents.push(docContent);
        }
        docContents = tmpContents;
        connectContent();
    },function (err) {
        console.log(err);
    });
}










wsServer.onopen = function (e) {
    initSocket();
};
wsServer.onclose = function (e) {//当链接关闭的时候触发

};
wsServer.onmessage = function (e) {//后台返回消息的时候触发
    let obj = JSON.parse(e.data.toString());
    let type = obj.type;
    if (type == SocketType.initSocketSuccess) {
        console.log("socket init success");
    } else if (type == SocketType.initSocketError) {
        console.log("socket init failed");
    } else if (type == SocketType.updateDoc) {
        if (docContents.length != obj.count) {
            reloadContent();
        }
    }
};
wsServer.onerror = function (e) {//错误情况触发

}

function initSocket() {
    let para = {
        type:SocketType.initSocket,
        cookie:getCookie("dmtoken"),
        doc_guid:k_doc_guid
    }
    wsServer.send(JSON.stringify(para));//向后台发送数据
}







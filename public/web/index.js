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
var wsServer = new WebSocket('ws://127.0.0.1:3001');
const k_doc_guid = "b576fd20-9364-48ae-8873-57778cc3293d";


let docInfo = new DocModel(); 
let docContents = [];  //DocContentModel[]
let docStrArr = [];

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


function createDoc(title) {
    var para = {
        title : title
    }
    $.post("./doc/createDoc",para , function(data,status){
        console.log(data);
        console.log(status);
    });
}

// 获取Doc信息
function getDocInfo(doc_guid) {
    var para = {
        doc_guid : doc_guid
    }

    $.post("./doc/docInfo",para , function(data,status){
        console.log(data);
        console.log(status);

        if (data.code != 200) {
            alert(data.msg);
            return;
        }

        obj = data.obj;
        doc = obj.doc;
        arr = obj.contents;

        docInfo.create_time = doc.create_time;
        docInfo.creater = doc.creater;
        docInfo.guid = doc.guid;
        docInfo.power = doc.power;
        docInfo.title = doc.title;
        
        this.guid = "";
        this.doc_guid = "";
        this.begin_line = 0;
        this.end_line = 0;
        this.content = "";
        this.creater = "";
        this.create_time = 0;

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
            docContents.push(docContent);
        }

        connectContent();
    });
}

function connectContent() {
    var strArr = [];

    for (let index = 0; index < docContents.length; index++) {
        const docContent = docContents[index];
        content = docContent.content;
        tmpArr = content.split("\n");
        strArr.splice(docContent.begin_line,docContent.end_line - docContent.begin_line + 1,tmpArr);
    }

    console.log(strArr);

    docStrArr = strArr;
    testEditor.setMarkdown(strArr.join("\n"));
}

function compareContent() {
    str = testEditor.getValue();
    strArr = str.split("\n");
    over_contents = str.split("\n");

    begin_line = 0;
    end_line = 0;

    new_begin_line = 0;
    new_end_line = 0;

    if (strArr.length != docStrArr.length) {
        debugger;
        for (let index = 0; index < docStrArr.length; index++) {
            const oldStr = docStrArr[index];
            const newStr = strArr[index];
            if (oldStr != newStr) {
                begin_line = index;
            }
        }

        strArr.splice(0,begin_line);

        for (let index = docStrArr.length-1; index >= 0; index--) {
            const oldStr = docStrArr[index];
            const newStr = strArr[strArr.length - 1];
            if (oldStr != newStr) {
                end_line = index;
                break;
            }
            strArr.pop();
        }

        content = null;
        if (strArr.length) {
            content = strArr.join("\n");
        }

        createContent(begin_line,end_line,content,over_contents);
    }
}

function createContent(begin_line,end_line,content,over_contents) {
    para = {
        doc_guid : k_doc_guid,
        begin_line : begin_line,
        end_line : end_line,
        content : content
    };

    console.log(para);
    
    $.post("./doc/createContent",para , function(data,status){
        console.log(data);
        console.log(status);

        if (data.code != 200) {
            alert(data.msg);
            return;
        } 
        docStrArr = over_contents;
        console.log("保存成功");
    });
}












wsServer.onopen = function (e) {
    if (typeof e == 'string') {
        wsServer.send(e);//向后台发送数据
        testEditor.setMarkdown(e);
    }
};
wsServer.onclose = function (e) {//当链接关闭的时候触发

};
wsServer.onmessage = function (e) {//后台返回消息的时候触发
        console.log(e);
};
wsServer.onerror = function (e) {//错误情况触发

}
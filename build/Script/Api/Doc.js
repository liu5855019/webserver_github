"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
let router = express.Router();
const DBConfig_1 = require("../Global/DBConfig");
const DMTools_1 = require("../Global/DMTools");
var md5 = require('../../JSTools/Md5');
const user_guid = "aef0bc71-bb7f-4631-b077-17b6fc649528";
class DocModel {
    constructor() {
        this.guid = "";
        this.title = "";
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
router.post('/createDoc', function (req, res) {
    let query = req.body;
    console.log(query);
    var title = query.title;
    var cookie = req.cookies;
    if (!title || title.length < 2) {
        res.send({
            "code": 201,
            "msg": "please gave me title",
            "obj": null
        });
        return;
    }
    // if (!cookie || cookie.length < 2) {
    //     res.send({
    //         "code":202,
    //         "msg":"please gave me cookie",
    //         "obj":null
    //     });
    //     return;
    // }
    DBConfig_1.pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        createDoc(title, user_guid, connection, res, function (vote_guid) {
            res.send({
                "code": 200,
                "msg": "Success",
                "obj": null
            });
            connection.release();
        });
    });
});
router.post('/createContent', function (req, res) {
    let query = req.body;
    console.log(query);
    var doc_guid = query.doc_guid;
    var begin_line = query.begin_line;
    var end_line = query.end_line;
    var content = query.content;
    var cookie = req.cookies;
    if (!doc_guid || doc_guid.length < 2) {
        res.send({
            "code": 201,
            "msg": "please gave me doc_guid",
            "obj": null
        });
        return;
    }
    // if (!cookie || cookie.length < 2) {
    //     res.send({
    //         "code":202,
    //         "msg":"please gave me cookie",
    //         "obj":null
    //     });
    //     return;
    // }
    DBConfig_1.pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        createContent(doc_guid, begin_line, end_line, content, user_guid, connection, res, function (result) {
            res.send({
                "code": 200,
                "msg": "Success",
                "obj": null
            });
            connection.release();
        });
    });
});
router.post('/docInfo', function (req, res) {
    let query = req.body;
    console.log(query);
    var doc_guid = query.doc_guid;
    var cookie = req.cookies;
    if (!doc_guid || doc_guid.length < 2) {
        res.send({
            "code": 201,
            "msg": "please gave me doc_guid",
            "obj": null
        });
        return;
    }
    // if (!cookie || cookie.length < 2) {
    //     res.send({
    //         "code":202,
    //         "msg":"please gave me cookie",
    //         "obj":null
    //     });
    //     return;
    // }
    DBConfig_1.pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        getDocInfo(doc_guid, connection, res, function (docModel) {
            getDocContentList(doc_guid, connection, res, function (contents) {
                res.send({
                    "code": 200,
                    "msg": "Success",
                    "obj": {
                        doc: docModel,
                        contents: contents
                    }
                });
                connection.release();
            });
        });
    });
});
function createDoc(title, createrGuid, connection, res, callback) {
    var sql = "INSERT INTO doc (guid,title,creater,create_time) VALUES(?,?,?,?)";
    var guid = DMTools_1.DMTools.guid();
    var values = [guid, title, createrGuid, new Date()];
    connection.query(sql, values, function (err, result) {
        if (err) {
            res.send(500, err);
            connection.release();
        }
        else {
            callback(guid);
        }
    });
}
function createContent(doc_guid, begin_line, end_line, content, createrGuid, connection, res, callback) {
    var sql = "INSERT INTO doc_content (guid,doc_guid,begin_line,end_line,content,creater,create_time) VALUES(?,?,?,?,?,?,?)";
    var guid = DMTools_1.DMTools.guid();
    var values = [guid, doc_guid, begin_line, end_line, content, createrGuid, new Date()];
    connection.query(sql, values, function (err, result) {
        if (err) {
            res.send(500, err);
            connection.release();
        }
        else {
            callback(result);
        }
    });
}
function getDocInfo(guid, connection, res, callback) {
    let sql = "SELECT * FROM doc where guid = ?";
    connection.query(sql, guid, function (err, result) {
        if (err) {
            res.send(500, err);
            connection.release();
        }
        else {
            let doc = new DocModel();
            if (result.length) {
                let tmpDoc = result[0];
                doc.guid = tmpDoc.guid;
                doc.title = tmpDoc.title;
                doc.creater = tmpDoc.creater;
                doc.create_time = tmpDoc.create_time.getTime();
                callback(doc);
            }
            else {
                res.send({
                    "code": 203,
                    "msg": "This doc is not exist",
                    "obj": null
                });
                connection.release();
            }
        }
    });
}
function getDocContentList(doc_guid, connection, res, callback) {
    let sql = "SELECT * FROM doc_content where doc_guid = ?";
    connection.query(sql, doc_guid, function (err, result) {
        if (err) {
            res.send(500, err);
            connection.release();
        }
        else {
            var docArr = [];
            for (let index = 0; index < result.length; index++) {
                const item = result[index];
                let model = new DocContentModel();
                model.guid = item.guid;
                model.content = item.content;
                model.create_time = item.create_time.getTime();
                model.creater = item.creater;
                model.doc_guid = item.doc_guid;
                model.begin_line = item.begin_line;
                model.end_line = item.end_line;
                docArr.push(model);
            }
            callback(docArr);
        }
    });
}
// function createOrUpdateUserInof(userInfo:UserInfoModel , createrGuid:string , connection:PoolConnection ,  res:any ,  callback:(result:any)=>void)
// {
//     var sql = "";
//     var values = null;
//     if (!userInfo.guid || userInfo.guid.length < 10) {
//         sql = "INSERT INTO user (guid,account_guid,user_name,department_guid,role_guid,updater,update_time) VALUES(?,?,?,?,?,?,?)";   
//         values = [DMTools.guid() , userInfo.account_guid , userInfo.user_name , userInfo.department_guid , userInfo.role_guid , createrGuid,new Date()];       
//     } else {
//         sql = "UPDATE user SET user_name = ? , department_guid = ? , role_guid = ? , updater = ? , update_time = ? WHERE account_guid = ?";
//         values = [userInfo.user_name , userInfo.department_guid , userInfo.role_guid , createrGuid , new Date() , userInfo.account_guid];
//     }
//     connection.query(sql, values , function (err,result) {
//         if (err) {
//             res.send(500,err);
//             connection.release();
//         } else {
//             callback(result);
//         }
//     });
// }
// function getUserInfo(account_guid : string, connection:PoolConnection ,  res:any ,  callback:(result:UserInfoModel)=>void) 
// {
//     let sql = "SELECT * FROM user u \
//     LEFT JOIN department d on u.department_guid = d.guid \
//     LEFT JOIN role r ON u.role_guid = r.guid \
//     where u.account_guid = ?"
//     connection.query(sql,account_guid,function (err,result) {
//         if (err) {
//             res.send(500,err);
//             connection.release();
//         } else {
//             let user = new UserInfoModel();
//             user.account_guid = account_guid;
//             if (result.length) {
//                 let tmpUser = result[0];
//                 user.guid = tmpUser.guid;
//                 user.department_guid = tmpUser.department_guid;
//                 user.department_name = tmpUser.department_name;
//                 user.role_guid = tmpUser.role_guid;
//                 user.role_name = tmpUser.role_name;
//                 user.user_name = tmpUser.user_name;
//                 callback(user);
//             } else {
//                 callback(user);
//             }
//         }
//     });
// }
// function getAccountList( connection:PoolConnection ,  res:any ,  callback:(result:UserInfoModel)=>void) 
// {
//     connection.query('SELECT * FROM account',function (err,result) {
//         if (err) {
//             res.send(500,err);
//             connection.release();
//         } else {
//             callback(result);
//         }
//     });
// }
module.exports = router;

import * as express from 'express';
import { IRoute, Router } from 'express-serve-static-core';
let router:Router = express.Router();

import {pool}  from "../Global/DBConfig";
import {DMTools} from "../Global/DMTools";
import {Project} from "../Global/Project";

import { PoolConnection } from 'mysql';
import { connect } from 'tls';
import { UserInfoModel } from './UserInfo';
import { wsm } from '../Global/WebSocketManager';

var md5 = require('../../JSTools/Md5');

class DocModel {
    guid = "";
    title = "";
    power = "";
    creater = "";
    create_time = 0;

    constructor() {
    }
}

class DocContentModel {
    guid = "";
    doc_guid = "";
    begin_line = 0;
    end_line = 0;
    content = "";
    creater = "";
    create_time = 0;

    constructor() {
    }
}


router.post('/createDoc', function (req , res) 
{
    let query = req.body;
    console.log(query);
    
    var title = query.title;

    pool.getConnection(function (err,connection) {  // 链接数据库
        if (err) {
            res.status(500).send(err);
            return;
        }
        Project.getUser(req,connection,res,function(user){
            createDoc(title,user.guid,connection,res,function (vote_guid) {
                res.send({
                    "code":200,
                    "msg":"Success",
                    "obj":null
                });
                connection.release();
            });
        });
    });
});


router.post('/createContent', function (req , res) 
{
    let query = req.body;
    console.log(query);
    
    let doc_guid = query.doc_guid;
    let begin_line = query.begin_line;
    let end_line = query.end_line;
    let content = query.content;
    let count = query.count;
    
    if (!doc_guid || doc_guid.length < 2) {
        res.send({
            "code":201,
            "msg":"please gave me doc_guid",
            "obj":null
        });
        return;
    }

    pool.getConnection(function (err,connection) {  // 链接数据库
        if (err) {
            res.status(500).send(err);
            return;
        }

        Project.getUser(req,connection,res,function (user){
            getDocInfo(doc_guid,connection,res,function (result) {
                var path = -1;
                if (result.power) {
                    path = result.power.indexOf(user.guid);
                }
                if (user.guid == result.creater || path != -1) {
                    getDocContentList(doc_guid,connection,res,function (contentList){
                        if (contentList.length == count) {
                            createContent(doc_guid,begin_line,end_line,content,user.guid,connection,res,function (result) {
                                res.send({
                                    "code":200,
                                    "msg":"Success",
                                    "obj":null
                                });
        
                                wsm.actionWithUpdateDoc(doc_guid,count+1);
                                connection.release();
                            });
                        } else {
                            res.send({
                                "code":202,
                                "msg":"Your doc list need update",
                                "obj":null
                            });
                            connection.release();
                        }
                    });
                } else {
                    res.send({
                        "code":300,
                        "msg":"You have no power to update this markdown",
                        "obj":null
                    });
                    connection.release();
                }
            });
        });
    });
});

//doc_guid
router.post('/docInfo', function (req , res) 
{
    let query = req.body;
    console.log(query);
    
    var doc_guid = query.doc_guid;

    if (!doc_guid || doc_guid.length < 2) {
        res.send({
            "code":201,
            "msg":"please gave me doc_guid",
            "obj":null
        });
        return;
    }

    pool.getConnection(function (err,connection) {  // 链接数据库
        if (err) {
            res.status(500).send(err);
            return;
        }

        getUser(req,connection,function(userGuid){
            getDocInfo(doc_guid,connection,res,function (docModel) {
                getDocContentList(doc_guid,connection,res,function (contents) {
                    res.send({
                        "code":200,
                        "msg":"Success",
                        "obj":{
                            doc:docModel,
                            contents:contents,
                            user:userGuid
                        }
                    });
                    connection.release();
                });
            });
        });
    });
});

router.post('/docList', function (req , res) 
{
    let query = req.body;
    console.log(query);

    pool.getConnection(function (err,connection) {  // 链接数据库
        if (err) {
            res.status(500).send(err);
            return;
        }

        Project.getUser(req,connection,res,function (user) {
            getDocList(user,connection,res,function (result) {
                res.send({
                    "code":200,
                    "msg":"Success",
                    "obj":result
                });
                connection.release();
            });
        });
    });
});

//doc_guid
router.post('/contentList', function (req , res) {
    let query = req.body;
    console.log(query);
    
    var doc_guid = query.doc_guid;
    if (!doc_guid || doc_guid.length < 2) {
        res.send({
            "code":201,
            "msg":"please gave me doc_guid",
            "obj":null
        });
        return;
    }

    pool.getConnection(function (err,connection) {  // 链接数据库
        if (err) {
            res.status(500).send(err);
            return;
        }
        getDocContentList(doc_guid,connection,res,function (contents) {
            res.send({
                "code":200,
                "msg":"Success",
                "obj":contents
            });
            connection.release();
        });
    });
})


function createDoc(title:string , createrGuid:string , connection:PoolConnection , res:any , callback:(vote_guid:string)=>void) 
{
    var sql = "INSERT INTO doc (guid,title,creater,create_time) VALUES(?,?,?,?)";
    var guid = DMTools.guid();
    var values = [guid,title,createrGuid,new Date()];

    connection.query(sql, values , function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            callback(guid);
        }
    });
}

function createContent(doc_guid:string , begin_line:number , end_line:number , content:string , createrGuid:string , connection:PoolConnection , res:any , callback:(result:any)=>void) 
{
    var sql = "INSERT INTO doc_content (guid,doc_guid,begin_line,end_line,content,creater,create_time) VALUES(?,?,?,?,?,?,?)";
    var guid = DMTools.guid();
    var values = [guid,doc_guid,begin_line,end_line,content,createrGuid,new Date()];

    connection.query(sql, values , function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            callback(result);
        }
    });
}



function getDocInfo(guid : string, connection:PoolConnection ,  res:any ,  callback:(result:DocModel)=>void) 
{
    let sql = "SELECT * FROM doc where guid = ?";

    connection.query(sql,guid,function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            let doc = new DocModel();
            if (result.length) {
                let tmpDoc = result[0];
                doc.guid = tmpDoc.guid;
                doc.title = tmpDoc.title;
                doc.creater = tmpDoc.creater;
                doc.create_time = tmpDoc.create_time.getTime();
                doc.power = tmpDoc.power;
                callback(doc);
            } else {
                res.send({
                    "code":203,
                    "msg":"This doc is not exist",
                    "obj":null
                });
                connection.release();
            }
        }
    });
}

function getDocContentList(doc_guid : string, connection:PoolConnection ,  res:any ,  callback:(result:DocContentModel[])=>void) 
{
    let sql = "SELECT * FROM doc_content where doc_guid = ?";

    connection.query(sql,doc_guid,function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            var docArr:DocContentModel[] = []; 
        
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


function getDocList(user : any, connection:PoolConnection ,  res:any ,  callback:(result:DocModel[])=>void) 
{
    let sql = "SELECT * FROM doc";

    connection.query(sql,function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            var docArr:DocModel[] = []; 
        
            for (let index = 0; index < result.length; index++) {
                const item = result[index];
                let model = new DocModel();     
                model.guid = item.guid;
                model.title = item.title;
                model.create_time = item.create_time.getTime();
                model.creater = item.creater;
                
                var path = -1;
                if (item.power) {
                    path = item.power.indexOf(user.guid);
                }
                if (model.creater == user.guid || path != -1) {
                    docArr.push(model);
                }
            }

            callback(docArr);
        }
    });
}

function getUser(req:any , connection:PoolConnection , callback:(userGuid:any)=>void) 
{
    var token = Project.getCookie("dmtoken",req.headers.cookie);
    if (!token || token.length < 10) {
        callback(null);
        return;
    }

    connection.query('SELECT * FROM account WHERE token = ?',token,function (err,result) {
        if (err) {
            callback(null);
            return;
        } 
        if (result.length) {
            let user = result[0];
            let date = user.token_time;
            let now = new Date();
            
            if (date.getTime() > now.getTime()) {
                callback(user.guid);
            } else {
                callback(null);
            }
        } else {
            callback(null);
        }
    })
}


module.exports = router;

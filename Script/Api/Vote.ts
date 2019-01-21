import * as express from 'express';
import { IRoute, Router } from 'express-serve-static-core';
let router:Router = express.Router();

import {pool}  from "../Global/DBConfig";
import {DMTools} from "../Global/DMTools";
import {Project} from "../Global/Project";

import { PoolConnection } from 'mysql';

var md5 = require('../../JSTools/Md5');

class VoteModel {
    guid : string = "";
    account_guid : string = "";
    user_name : string = "";
    department_guid : string = "";
    department_name : string = "";
    role_guid : string = "";
    role_name : string = "";

    constructor() {    
    }
}


router.post('/createVote', function (req , res) 
{
    let query = req.body;
    console.log(query);

    var title = query.title;
    var content = query.content;
    
    if (!title || title.length < 2) {
        res.send({
            "code":201,
            "msg":"please gave me title",
            "obj":null
        });
        return;
    }

    if (!content || content.length < 2) {
        res.send({
            "code":202,
            "msg":"please gave me content",
            "obj":null
        });
        return;
    }

    
    
    pool.getConnection(function (err,connection) {  // 链接数据库
        if (err) {
            res.status(500).send(err);
            return;
        }
        Project.getuser(req,connection,res,function (user) {        
            createVote(title,content,flow,user.guid,connection,res,function (vote_guid) {
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

// router.post('/userInfo', function (req,res) {
//     let query = req.body;
//     console.log(query);

//     var account_guid : string =  query.account_guid;

//     if (!account_guid || account_guid.length < 10) {
//         res.send({
//             "code":201,
//             "msg":"please gave me account guid",
//             "obj":null
//         });
//         return;
//     }

//     pool.getConnection(function (err,connection) {
//         if (err) {
//             res.status(500).send(err);
//             return;
//         }
//         Project.getuser(req,connection,res,function (user) {            
//             getUserInfo(account_guid,connection,res,function (result) {           
//                 res.send({
//                     "code":200,
//                     "msg":"Success",
//                     "obj":result
//                 });
//                 connection.release();
//             });
//         });
//     });
// });

// router.post('/accountList', function (req,res) {
//     pool.getConnection(function (err,connection) {
//         if (err) {
//             res.status(500).send(err);
//             return;
//         }
//         Project.getuser(req,connection,res,function (user) {       
//             getAccountList(connection,res,function (result) {           
//                 res.send({
//                     "code":200,
//                     "msg":"Success",
//                     "obj":result
//                 });
//                 connection.release();
//             });
//         });
//     });
// });




function createVote(title:string , content:string , flow:string , createrGuid:string , connection:PoolConnection ,  res:any ,  callback:(vote_guid:string)=>void)
{
    var sql = "INSERT INTO vote (guid,title,content,flow,current_node,creater,create_time) VALUES(?,?,?,?,?,?,?)";
    var guid = DMTools.guid();
    var values = [guid,title,content,flow,1,createrGuid,new Date()];

    connection.query(sql, values , function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            callback(guid);
        }
    });
}

function createVoteItem(vote_guid:string , item:string , createrGuid:string , connection:PoolConnection ,  res:any ,  callback:(result:any)=>void)
{
    var sql = "INSERT INTO vote_item (guid,vote_guid,item,creater,create_time) VALUES(?,?,?,?,?)";
    
    var values = [DMTools.guid(),vote_guid,item,createrGuid,new Date()];

    connection.query(sql, values , function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            callback(result);
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

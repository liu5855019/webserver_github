// user.js - user route module.

import * as express from 'express';
import { IRoute, Router } from 'express-serve-static-core';
let router:Router = express.Router();

import {pool}  from "../Global/DBConfig";
import {DMTools} from "../Global/DMTools";

import { PoolConnection } from 'mysql';

var md5 = require('../../JSTools/Md5');




/** 注册用户 */
router.post('/regist', function (req , res) {

    let query = req.body;
    console.log(query);

    var username = query.username;
    var password = query.password;

    if (!username || !password) {
        res.send({
            "code":201,
            "msg":"Username or Password cannot null",
            "obj":{}
        });
        return;
    }

    if (username.length < 4 || password.length < 3) {
        res.send({
            "code":202,
            "msg":"Username or Password is too short",
            "obj":{}
        });
        return;
    }

    if (username.length > 15 || password.length > 15) {
        res.send({
            "code":203,
            "msg":"Username or Password is too long",
            "obj":{}
        });
        return;
    }

    pool.getConnection(function (err,connection) {  // 链接数据库
        if (err) {
            res.status(500).send(err);
            return;
        } 
        //检查用户是否存在
        checkUser(connection,username,res,function (result) {   
            if (result.length) {
                res.send({
                    "code":204,
                    "msg":"This user is exist",
                    "obj":null
                });
                connection.release();
                return;
            } 
            //注册
            register(connection,username,password,res,function (result) {
                res.send({
                    "code":200,
                    "msg":"success",
                    "obj":{}
                }); 
                connection.release();    
            });
        });
    });
});

/** 登录 */
router.post('/login',function (req,res) {

    let query = req.body;
    console.log(query);

    var username = query.username;
    var password = query.password;

    if (!username || !password) {
        res.send({
            "code":201,
            "msg":"Username or Password cannot null",
            "obj":{}
        });
        return;
    }

    if (username.length < 4 || password.length < 3) {
        res.send({
            "code":202,
            "msg":"Username or Password is too short",
            "obj":{}
        });
        return;
    }

    if (username.length > 15 || password.length > 15) {
        res.send({
            "code":203,
            "msg":"Username or Password is too long",
            "obj":{}
        });
        return;
    }


    pool.getConnection(function (err,connection) {  // 链接数据库
        if (err) {
            res.status(500).send(err);
            return;
        } 

        checkUser(connection,username,res,function (result) {
            if (result.length) {
                let user = result[0];
                let password1 = user.password;
                
                if (password1 == password) {
                    let timeInterval = new Date().getTime();
                    let tmpStr = username + timeInterval;
                    let token = md5(tmpStr);
                    console.log(token);
                    var date =  new Date(timeInterval + 3 * 3600000);

                    login(connection,username,token,date,res,function(result) {
                        res.send({
                            "code":200,
                            "msg":"Login success",
                            "obj":{
                                "token":token,
                                "time":timeInterval
                            }
                        });
                        connection.release();
                    });
                } else {
                    res.send({
                        "code":205,
                        "msg":"Wrong password",
                        "obj":{}
                    });
                    connection.release();
                }
            } else {
                res.send({
                    "code":204,
                    "msg":"This user is not exist",
                    "obj":{}
                });
                connection.release();
            }
        });
    });
})





function checkUser(connection:PoolConnection , username:string , res:any , callback:(result:any)=>void )
{
    connection.query('SELECT * FROM account WHERE username = ?' , username , function (err,result) {    
        if (err) {
            res.status(500).send(err);
            connection.release();
        } else {
            callback(result);
        }
    });
}

function register(connection:PoolConnection , username:string , password:string , res:any , callback:(result:any)=>void) {
    connection.query('INSERT INTO account(guid,username,password,create_time) VALUES(?,?,?,?)',[DMTools.guid(),username,password,new Date()], function (err, result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            callback(result);
        }
    });
}

//登录操作,插入token,插入登录超时时间
function login(connection:PoolConnection , username:string , token:string , token_time:Date , res:any , callback:(result:any)=>void) {
    connection.query('UPDATE account SET token = ? , token_time = ? WHERE username = ?',[token,token_time,username],function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            callback(result);
        }
    })
}



module.exports = router;

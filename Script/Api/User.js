// user.js - user route module.

var express = require('express');
var router = express.Router();

var pool = require('../DBConfig');
var md5 = require('../Global/Md5');
var dmtools = require('../Global/DMTools')

var userSql = {
    selectAll : 'SELECT * FROM user',
}

/** 获取用户列表 */
router.get('/userList', function (req, res) {
    pool.getConnection(function(err, connection){
        if (err) {
            console.log('link_err');
            res.send(500,'link_err');
        } else {
            connection.query(userSql.selectAll, function (err, result) {
                if (err) {
                    res.send(500,'select error');
                } else {
                    res.send({
                        "code":200,
                        "msg":"success",
                        "obj":result
                    });
                }
            })
        }
    })
});

/** 注册用户 */
router.get('/register', function (req , res) {
    console.log(req.query);
    
    var username = req.query.username;
    var password = req.query.password;

    if (!username || !password) {
        res.send(500,{
            "code":204,
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
            res.send(500,'link error');
            return;
        } 
        //检查用户是否存在
        checkUser(connection,username,res,function (result) {   
            if (result.length) {
                res.send({
                    "code":201,
                    "msg":"This user is exist",
                    "obj":{}
                });
                return;
            } 
            //注册
            register(connection,username,password,res,function (result) {
                console.log(result);
                res.send({
                    "code":200,
                    "msg":"success",
                    "obj":{}
                });     
            });
        });
    });
});

/** 登录 */
router.get('/login',function (req,res) {

    let username = req.query.username;
    let password = req.query.password;

    pool.getConnection(function (err,connection) {  // 链接数据库
        if (err) {
            res.send(500,err);
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
                    });
                } else {
                    res.send({
                        "code":202,
                        "msg":"Wrong password",
                        "obj":{}
                    });
                }
            } else {
                res.send({
                    "code":201,
                    "msg":"This user is not exist",
                    "obj":{}
                });
            }
        });
    });
})





function checkUser(connection,username,res,callback) {
    connection.query('SELECT * FROM user WHERE username = ?' , username , function (err,result) {    
        if (err) {
            res.send(500,err);
        } else {
            callback(result);
        }
    });
}

function register(connection,username,password,res,callback) {
    connection.query('INSERT INTO user(guid,username,password,create_time) VALUES(?,?,?,?)',[dmtools.guid(),username,password,new Date()], function (err, result) {
        if (err) {
            res.send(500,err);
        } else {
            callback(result);
        }
    });
}

//登录操作,插入token,插入登录超时时间
function login(connection,username,token,token_time,res,callback) {
    connection.query('UPDATE user SET token = ? , token_time = ? WHERE username = ?',[token,token_time,username],function (err,result) {
        if (err) {
            res.send(500,err);
        } else {
            callback(result);
        }
    })
}



module.exports = router;

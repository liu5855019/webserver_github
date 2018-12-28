var express = require('express');
var router = express.Router();

var pool = require('../DBConfig');
var md5 = require('../Global/Md5');
var dmtools = require('../Global/DMTools')



/** 注册用户 */
router.get('/createRole', function (req , res) {
    console.log(req.query);
    
    var username = req.query.username;
    var password = req.query.password;

    if (username.length < 4 || password.length < 3) {
        res.send({
            "code":202,
            "msg":"Username or Password is too short",
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

function register(role_name) {
    connection.query('INSERT INTO role(guid,role_name) VALUES(?,?)',[dmtools.guid(),role_name], function (err, result) {
        if (err) {
            res.send(500,err);
        } else {
            callback(result);
        }
    });
}




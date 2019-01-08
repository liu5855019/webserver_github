var express = require('express');
var router = express.Router();

var pool = require('../DBConfig');
var md5 = require('../Global/Md5');
var dmtools = require('../Global/DMTools')

var project = require('../Global/Project')




router.post('/createRole', function (req , res) {

    let query = req.body;
    console.log(query);

    var roleName = query.roleName;
    
    if (!roleName) {
        res.send({
            "code":201,
            "msg":"Role name cannot null",
            "obj":null
        });
        return;
    }

    if (roleName.length < 1) {
        res.send({
            "code":202,
            "msg":"Role name is too short",
            "obj":null
        });
        return;
    }
    
    if (roleName.length > 15) {
        res.send({
            "code":203,
            "msg":"Role name is too long",
            "obj":null
        });
        return;
    }
    
    pool.getConnection(function (err,connection) {  // 链接数据库
        if (err) {
            res.send(500,err);
            return;
        }

        project.getuser(req,connection,res,function (user) {
            console.log(user);
            
        });

        // //检查用户是否存在
        // checkUser(connection,username,res,function (result) {   
        //     if (result.length) {
        //         res.send({
        //             "code":201,
        //             "msg":"This user is exist",
        //             "obj":null
        //         });
        //         return;
        //     } 
        //     //注册
        //     register(connection,username,password,res,function (result) {
        //         console.log(result);
        //         res.send({
        //             "code":200,
        //             "msg":"success",
        //             "obj":{}
        //         });     
        //     });
        // });
    });
});



function createRole(role_name,createrGuid,connection,res,callback) {
    connection.query('INSERT INTO role(guid,role_name,creater,create_time) VALUES(?,?,?,?)',[dmtools.guid(),role_name,createrGuid,new Date()], function (err, result) {
        if (err) {
            res.send(500,err);
        } else {
            callback(result);
        }
    });
}

function checkRole(role_name,connection,res,callback) {
    connection.query('SELECT * FROM role WHERE role_name = ?' , role_name , function (err,result) {    
        if (err) {
            res.send(500,err);
        } else {
            callback(result);
        }
    });
}


module.exports = router;


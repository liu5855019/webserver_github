import * as express from 'express';
import { IRoute, Router } from 'express-serve-static-core';
let router:Router = express.Router();

import {pool}  from "../Global/DBConfig";
import {DMTools} from "../Global/DMTools";
import {Project} from "../Global/Project";

import { PoolConnection } from 'mysql';

var md5 = require('../../JSTools/Md5');




router.post('/createModule', function (req , res) 
{
    let query = req.body;
    console.log(query);

    var module_name = query.module_name;
    
    if (!module_name) {
        res.send({
            "code":201,
            "msg":"Module name cannot null",
            "obj":null
        });
        return;
    }

    if (module_name.length < 2) {
        res.send({
            "code":202,
            "msg":"Module name is too short",
            "obj":null
        });
        return;
    }
    
    if (module_name.length > 15) {
        res.send({
            "code":203,
            "msg":"Module name is too long",
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
            createModule(module_name,user.guid,connection,res,function (result) {
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

router.post('/moduleList', function (req,res) {
    pool.getConnection(function (err,connection) {
        if (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
        }
        Project.getuser(req,connection,res,function (user) {            
            moduleList(connection,res,function (result) {
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






function createModule(module_name:string , createrGuid:string , connection:PoolConnection ,  res:any ,  callback:(result:any)=>void)
{
    let values = [DMTools.guid(),module_name,createrGuid,new Date()];
    connection.query('INSERT INTO module(guid,module_name,creater,create_time) VALUES(?,?,?,?)', values , function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            callback(result);
        }
    });
}

function moduleList(connection:PoolConnection ,  res:any ,  callback:(result:any)=>void) 
{
    connection.query('SELECT * FROM module',function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            callback(result);
        }
    });
}


module.exports = router;

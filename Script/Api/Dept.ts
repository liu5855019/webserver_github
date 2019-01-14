import * as express from 'express';
import { IRoute, Router } from 'express-serve-static-core';
let router:Router = express.Router();

import {pool}  from "../Global/DBConfig";
import {DMTools} from "../Global/DMTools";
import {Project} from "../Global/Project";

import { PoolConnection } from 'mysql';

var md5 = require('../../JSTools/Md5');




router.post('/createCompany', function (req , res) 
{
    let query = req.body;
    console.log(query);

    var companyName = query.companyName;
    
    if (!companyName) {
        res.send({
            "code":201,
            "msg":"Company name cannot null",
            "obj":null
        });
        return;
    }

    if (companyName.length < 2) {
        res.send({
            "code":202,
            "msg":"Company name is too short",
            "obj":null
        });
        return;
    }
    
    if (companyName.length > 15) {
        res.send({
            "code":203,
            "msg":"Company name is too long",
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
            createCompany(companyName,user.guid,connection,res,function (result) {
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

router.post('/companyList', function (req,res) {
    pool.getConnection(function (err,connection) {
        if (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
        }
        Project.getuser(req,connection,res,function (user) {            
            companyList(connection,res,function (result) {
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

router.post('/createDepartment', function (req , res) 
{
    let query = req.body;
    console.log(query);

    var departmentName = query.departmentName;
    var companyGuid = query.companyGuid;
    
    if (!departmentName) {
        res.send({
            "code":201,
            "msg":"Department name cannot null",
            "obj":null
        });
        return;
    }

    if (departmentName.length < 2) {
        res.send({
            "code":202,
            "msg":"Company name is too short",
            "obj":null
        });
        return;
    }
    
    if (departmentName.length > 15) {
        res.send({
            "code":203,
            "msg":"Company name is too long",
            "obj":null
        });
        return;
    }

    if (!companyGuid || companyGuid.length < 15) {
        res.send({
            "code":204,
            "msg":"Wrong company guid",
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
            createDept(departmentName,companyGuid,user.guid,connection,res,function (result){
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


router.post('/departmentList', function (req,res) {
    pool.getConnection(function (err,connection) {
        if (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
        }
        Project.getuser(req,connection,res,function (user) {            
            deptList(connection,res,function (result) {
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




function createCompany(companyName:string , createrGuid:string , connection:PoolConnection ,  res:any ,  callback:(result:any)=>void)
{
    let values = [DMTools.guid(),companyName,createrGuid,new Date()];
    connection.query('INSERT INTO company(guid,company_name,creater,create_time) VALUES(?,?,?,?)', values , function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            callback(result);
        }
    });
}

function companyList(connection:PoolConnection ,  res:any ,  callback:(result:any)=>void) 
{
    connection.query('SELECT * FROM company',function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            callback(result);
        }
    });
}

function createDept(department_name:string , company_guid:string , createrGuid:string , connection:PoolConnection ,  res:any ,  callback:(result:any)=>void)
{
    let values = [DMTools.guid(),department_name,company_guid,createrGuid,new Date()];
    connection.query('INSERT INTO department(guid,department_name,company_guid,creater,create_time) VALUES(?,?,?,?,?)', values , function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            callback(result);
        }
    });
}

function deptList(connection:PoolConnection ,  res:any ,  callback:(result:any)=>void) 
{
    connection.query('SELECT * FROM department',function (err,result) {
        if (err) {
            res.send(500,err);
            connection.release();
        } else {
            callback(result);
        }
    });
}






module.exports = router;


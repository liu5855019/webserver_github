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
const Project_1 = require("../Global/Project");
var md5 = require('../../JSTools/Md5');
router.post('/createCompany', function (req, res) {
    let query = req.body;
    console.log(query);
    var companyName = query.companyName;
    if (!companyName) {
        res.send({
            "code": 201,
            "msg": "Company name cannot null",
            "obj": null
        });
        return;
    }
    if (companyName.length < 2) {
        res.send({
            "code": 202,
            "msg": "Company name is too short",
            "obj": null
        });
        return;
    }
    if (companyName.length > 15) {
        res.send({
            "code": 203,
            "msg": "Company name is too long",
            "obj": null
        });
        return;
    }
    DBConfig_1.pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        Project_1.Project.getuser(req, connection, res, function (user) {
            createCompany(companyName, user.guid, connection, res, function (result) {
                res.send({
                    "code": 200,
                    "msg": "Success",
                    "obj": null
                });
            });
        });
    });
});
router.post('/companyList', function (req, res) {
    DBConfig_1.pool.getConnection(function (err, connection) {
        if (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
        }
        Project_1.Project.getuser(req, connection, res, function (user) {
            companyList(connection, res, function (result) {
                res.send({
                    "code": 200,
                    "msg": "Success",
                    "obj": result
                });
            });
        });
    });
});
function createCompany(companyName, createrGuid, connection, res, callback) {
    let values = [DMTools_1.DMTools.guid(), companyName, createrGuid, new Date()];
    connection.query('INSERT INTO company(guid,company_name,creater,create_time) VALUES(?,?,?,?)', values, function (err, result) {
        if (err) {
            res.send(500, err);
        }
        else {
            callback(result);
        }
    });
}
function companyList(connection, res, callback) {
    connection.query('SELECT * FROM company', function (err, result) {
        if (err) {
            res.send(500, err);
        }
        else {
            callback(result);
        }
    });
}
// function createRole(role_name,createrGuid,connection,res,callback) {
//     connection.query('INSERT INTO role(guid,role_name,creater,create_time) VALUES(?,?,?,?)',[dmtools.guid(),role_name,createrGuid,new Date()], function (err, result) {
//         if (err) {
//             res.send(500,err);
//         } else {
//             callback(result);
//         }
//     });
// }
// function checkRole(role_name,connection,res,callback) {
//     connection.query('SELECT * FROM role WHERE role_name = ?' , role_name , function (err,result) {    
//         if (err) {
//             res.send(500,err);
//         } else {
//             callback(result);
//         }
//     });
// }
module.exports = router;
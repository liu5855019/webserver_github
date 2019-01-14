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
router.post('/createModule', function (req, res) {
    let query = req.body;
    console.log(query);
    var module_name = query.module_name;
    if (!module_name) {
        res.send({
            "code": 201,
            "msg": "Module name cannot null",
            "obj": null
        });
        return;
    }
    if (module_name.length < 2) {
        res.send({
            "code": 202,
            "msg": "Module name is too short",
            "obj": null
        });
        return;
    }
    if (module_name.length > 15) {
        res.send({
            "code": 203,
            "msg": "Module name is too long",
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
            createModule(module_name, user.guid, connection, res, function (result) {
                res.send({
                    "code": 200,
                    "msg": "Success",
                    "obj": null
                });
            });
        });
    });
});
router.post('/moduleList', function (req, res) {
    DBConfig_1.pool.getConnection(function (err, connection) {
        if (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
        }
        Project_1.Project.getuser(req, connection, res, function (user) {
            moduleList(connection, res, function (result) {
                res.send({
                    "code": 200,
                    "msg": "Success",
                    "obj": result
                });
            });
        });
    });
});
function createModule(module_name, createrGuid, connection, res, callback) {
    let values = [DMTools_1.DMTools.guid(), module_name, createrGuid, new Date()];
    connection.query('INSERT INTO module(guid,module_name,creater,create_time) VALUES(?,?,?,?)', values, function (err, result) {
        if (err) {
            res.send(500, err);
        }
        else {
            callback(result);
        }
    });
}
function moduleList(connection, res, callback) {
    connection.query('SELECT * FROM module', function (err, result) {
        if (err) {
            res.send(500, err);
        }
        else {
            callback(result);
        }
    });
}
module.exports = router;

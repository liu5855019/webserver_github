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
router.post('/createFlow', function (req, res) {
    let query = req.body;
    console.log(query);
    var flow_name = query.flow_name;
    var module_guid = query.module_guid;
    var flows = query.flows;
    var flow = flows.join(',');
    if (!flow_name) {
        res.send({
            "code": 201,
            "msg": "Role name cannot null",
            "obj": null
        });
        return;
    }
    if (flow_name.length < 2) {
        res.send({
            "code": 202,
            "msg": "Role name is too short",
            "obj": null
        });
        return;
    }
    if (flow_name.length > 15) {
        res.send({
            "code": 203,
            "msg": "Role name is too long",
            "obj": null
        });
        return;
    }
    DBConfig_1.pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        Project_1.Project.getUser(req, connection, res, function (user) {
            createFlow(flow_name, module_guid, flows[0], flow, user.guid, connection, res, function (result) {
                res.send({
                    "code": 200,
                    "msg": "Success",
                    "obj": null
                });
                connection.release();
            });
        });
    });
});
router.post('/flowList', function (req, res) {
    DBConfig_1.pool.getConnection(function (err, connection) {
        if (err) {
            if (err) {
                res.status(500).send(err);
                return;
            }
        }
        Project_1.Project.getUser(req, connection, res, function (user) {
            companyList(connection, res, function (result) {
                res.send({
                    "code": 200,
                    "msg": "Success",
                    "obj": result
                });
                connection.release();
            });
        });
    });
});
function createFlow(flow_name, module_guid, role_guid, flow, createrGuid, connection, res, callback) {
    let values = [DMTools_1.DMTools.guid(), flow_name, module_guid, role_guid, flow, createrGuid, new Date()];
    connection.query('INSERT INTO flow(guid,flow_name,module_guid,role_guid,flow,creater,create_time) VALUES(?,?,?,?,?,?,?)', values, function (err, result) {
        if (err) {
            res.send(500, err);
            connection.release();
        }
        else {
            callback(result);
        }
    });
}
function companyList(connection, res, callback) {
    connection.query('SELECT * FROM flow', function (err, result) {
        if (err) {
            res.send(500, err);
            connection.release();
        }
        else {
            callback(result);
        }
    });
}
module.exports = router;

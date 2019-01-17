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
class UserInfoModel {
    constructor() {
        this.guid = "";
        this.account_guid = "";
        this.user_name = "";
        this.department_guid = "";
        this.department_name = "";
        this.role_guid = "";
        this.role_name = "";
    }
}
router.post('/updateUserInfo', function (req, res) {
    let query = req.body;
    console.log(query);
    var account_guid = query.account_guid;
    var user_name = query.user_name;
    var department_guid = query.department_guid;
    var role_guid = query.role_guid;
    if (!account_guid || account_guid.length < 10) {
        res.send({
            "code": 201,
            "msg": "please gave me account guid",
            "obj": null
        });
        return;
    }
    if (!user_name || user_name.length < 2) {
        res.send({
            "code": 202,
            "msg": "please gave me user name",
            "obj": null
        });
        return;
    }
    if (!department_guid || department_guid.length < 10) {
        res.send({
            "code": 203,
            "msg": "please gave me department",
            "obj": null
        });
        return;
    }
    if (!role_guid || role_guid.length < 10) {
        res.send({
            "code": 204,
            "msg": "please gave me role",
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
            getUserInfo(account_guid, connection, res, function (userInfo) {
                userInfo.user_name = user_name;
                userInfo.department_guid = department_guid;
                userInfo.role_guid = role_guid;
                createOrUpdateUserInof(userInfo, user.guid, connection, res, function (result) {
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
});
router.post('/userInfo', function (req, res) {
    let query = req.body;
    console.log(query);
    var account_guid = query.account_guid;
    if (!account_guid || account_guid.length < 10) {
        res.send({
            "code": 201,
            "msg": "please gave me account guid",
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
            getUserInfo(account_guid, connection, res, function (result) {
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
router.post('/accountList', function (req, res) {
    DBConfig_1.pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        Project_1.Project.getuser(req, connection, res, function (user) {
            getAccountList(connection, res, function (result) {
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
function createOrUpdateUserInof(userInfo, createrGuid, connection, res, callback) {
    var sql = "";
    var values = null;
    if (!userInfo.guid || userInfo.guid.length < 10) {
        sql = "INSERT INTO user (guid,account_guid,user_name,department_guid,role_guid,updater,update_time) VALUES(?,?,?,?,?,?,?)";
        values = [DMTools_1.DMTools.guid(), userInfo.account_guid, userInfo.user_name, userInfo.department_guid, userInfo.role_guid, createrGuid, new Date()];
    }
    else {
        sql = "UPDATE user SET user_name = ? , department_guid = ? , role_guid = ? , updater = ? , update_time = ? WHERE account_guid = ?";
        values = [userInfo.user_name, userInfo.department_guid, userInfo.role_guid, createrGuid, new Date(), userInfo.account_guid];
    }
    connection.query(sql, values, function (err, result) {
        if (err) {
            res.send(500, err);
            connection.release();
        }
        else {
            callback(result);
        }
    });
}
function getUserInfo(account_guid, connection, res, callback) {
    let sql = "SELECT * FROM user u \
    LEFT JOIN department d on u.department_guid = d.guid \
    LEFT JOIN role r ON u.role_guid = r.guid \
    where u.account_guid = ?";
    connection.query(sql, account_guid, function (err, result) {
        if (err) {
            res.send(500, err);
            connection.release();
        }
        else {
            let user = new UserInfoModel();
            user.account_guid = account_guid;
            if (result.length) {
                let tmpUser = result[0];
                user.guid = tmpUser.guid;
                user.department_guid = tmpUser.department_guid;
                user.department_name = tmpUser.department_name;
                user.role_guid = tmpUser.role_guid;
                user.role_name = tmpUser.role_name;
                user.user_name = tmpUser.user_name;
                callback(user);
            }
            else {
                callback(user);
            }
        }
    });
}
function getAccountList(connection, res, callback) {
    connection.query('SELECT * FROM account', function (err, result) {
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

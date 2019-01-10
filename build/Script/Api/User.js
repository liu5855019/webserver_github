"use strict";
// user.js - user route module.
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
var md5 = require('../../JSTools/Md5');
/** 注册用户 */
router.post('/regist', function (req, res) {
    let query = req.body;
    console.log(query);
    var username = query.username;
    var password = query.password;
    if (!username || !password) {
        res.send({
            "code": 201,
            "msg": "Username or Password cannot null",
            "obj": {}
        });
        return;
    }
    if (username.length < 4 || password.length < 3) {
        res.send({
            "code": 202,
            "msg": "Username or Password is too short",
            "obj": {}
        });
        return;
    }
    if (username.length > 15 || password.length > 15) {
        res.send({
            "code": 203,
            "msg": "Username or Password is too long",
            "obj": {}
        });
        return;
    }
    DBConfig_1.pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        //检查用户是否存在
        checkUser(connection, username, res, function (result) {
            if (result.length) {
                res.send({
                    "code": 204,
                    "msg": "This user is exist",
                    "obj": null
                });
                return;
            }
            //注册
            register(connection, username, password, res, function (result) {
                console.log(result);
                res.send({
                    "code": 200,
                    "msg": "success",
                    "obj": {}
                });
            });
        });
    });
});
/** 登录 */
router.post('/login', function (req, res) {
    let query = req.body;
    console.log(query);
    var username = query.username;
    var password = query.password;
    if (!username || !password) {
        res.send({
            "code": 201,
            "msg": "Username or Password cannot null",
            "obj": {}
        });
        return;
    }
    if (username.length < 4 || password.length < 3) {
        res.send({
            "code": 202,
            "msg": "Username or Password is too short",
            "obj": {}
        });
        return;
    }
    if (username.length > 15 || password.length > 15) {
        res.send({
            "code": 203,
            "msg": "Username or Password is too long",
            "obj": {}
        });
        return;
    }
    DBConfig_1.pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send(err);
            return;
        }
        checkUser(connection, username, res, function (result) {
            if (result.length) {
                let user = result[0];
                let password1 = user.password;
                if (password1 == password) {
                    let timeInterval = new Date().getTime();
                    let tmpStr = username + timeInterval;
                    let token = md5(tmpStr);
                    console.log(token);
                    var date = new Date(timeInterval + 3 * 3600000);
                    login(connection, username, token, date, res, function (result) {
                        res.send({
                            "code": 200,
                            "msg": "Login success",
                            "obj": {
                                "token": token,
                                "time": timeInterval
                            }
                        });
                    });
                }
                else {
                    res.send({
                        "code": 205,
                        "msg": "Wrong password",
                        "obj": {}
                    });
                }
            }
            else {
                res.send({
                    "code": 204,
                    "msg": "This user is not exist",
                    "obj": {}
                });
            }
        });
    });
});
function checkUser(connection, username, res, callback) {
    connection.query('SELECT * FROM account WHERE username = ?', username, function (err, result) {
        if (err) {
            res.status(500).send(err);
        }
        else {
            callback(result);
        }
    });
}
function register(connection, username, password, res, callback) {
    connection.query('INSERT INTO account(guid,username,password,create_time) VALUES(?,?,?,?)', [DMTools_1.DMTools.guid(), username, password, new Date()], function (err, result) {
        if (err) {
            res.send(500, err);
        }
        else {
            callback(result);
        }
    });
}
//登录操作,插入token,插入登录超时时间
function login(connection, username, token, token_time, res, callback) {
    connection.query('UPDATE account SET token = ? , token_time = ? WHERE username = ?', [token, token_time, username], function (err, result) {
        if (err) {
            res.send(500, err);
        }
        else {
            callback(result);
        }
    });
}
module.exports = router;

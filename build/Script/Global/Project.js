"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserInfo_1 = require("../Api/UserInfo");
function getCookie(c_name, cookie) {
    if (cookie.length > 0) {
        var c_start = cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            var c_end = cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = cookie.length;
            }
            return unescape(cookie.substring(c_start, c_end));
        }
    }
    return "";
}
class Project {
    constructor() {
    }
    static getUser(req, connection, res, callback) {
        var token = "";
        var cookie = req.headers.cookie;
        token = getCookie("dmtoken", cookie);
        if (token.length < 10) {
            token = req.headers.token;
        }
        //let token : string = req.headers.token;
        if (!token || token.length < 10) {
            res.send({
                "code": 401,
                "msg": "This token is not exist or overdue",
                "obj": null
            });
            connection.release();
            return;
        }
        connection.query('SELECT * FROM account WHERE token = ?', token, function (err, result) {
            if (err) {
                res.send(500, err);
                connection.release();
                return;
            }
            if (result.length) {
                let user = result[0];
                let date = user.token_time;
                let now = new Date();
                if (date.getTime() > now.getTime()) {
                    callback(user);
                }
                else {
                    res.send({
                        "code": 401,
                        "msg": "This token is not exist or overdue",
                        "obj": null
                    });
                    connection.release();
                }
            }
            else {
                res.send({
                    "code": 401,
                    "msg": "This token is not exist or overdue",
                    "obj": null
                });
                connection.release();
            }
        });
    }
    static getFlow(module_identify, account_guid, connection, res, callback) {
        UserInfo_1.UserInfoModel.getUserInfo(account_guid, connection, res, function (user_info_model) {
            if (user_info_model.role_guid.length < 10) {
                res.send({
                    "code": 402,
                    "msg": "There is no role find",
                    "obj": null
                });
                connection.release();
                return;
            }
            connection.query('SELECT * FROM module WHERE identify = ?', module_identify, function (err, result) {
                if (err) {
                    res.send(500, err);
                    connection.release();
                    return;
                }
                if (result.length < 1) {
                    res.send({
                        "code": 402,
                        "msg": "There is no module find",
                        "obj": null
                    });
                    connection.release();
                    return;
                }
                let module = result[0];
                let module_guid = module.guid;
                connection.query("SELECT * FROM flow WHERE module_guid = ? AND role_guid = ?", [module_guid, user_info_model.role_guid], function (err, flowResult) {
                    if (err) {
                        res.send(500, err);
                        connection.release();
                        return;
                    }
                    if (flowResult.length < 1) {
                        res.send({
                            "code": 402,
                            "msg": "There is no flow find",
                            "obj": null
                        });
                        connection.release();
                        return;
                    }
                    callback(flowResult[0]);
                });
            });
        });
    }
}
exports.Project = Project;

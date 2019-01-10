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
router.get("/hello", function (req, res) {
    let query = req.query;
    console.log('aaaaaaaaa');
    DBConfig_1.pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            res.send({
                "aaa": connection
            });
        }
    });
});
module.exports = router;

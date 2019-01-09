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
//import { pool } from "../Global/DBConfig";
router.get("/hello", function (req, res) {
    let query = req.query;
    console.log('aaaaaaaaa');
    res.send('444444');
    // pool.getConnection(function(err, connection) {
    //     if (err) {
    //         console.log('link_err');
    //         res.send([500,err]);
    //     } else {
    //         res.send({
    //             "aaa":connection
    //         });
    //     }
    // });
});
module.exports = router;

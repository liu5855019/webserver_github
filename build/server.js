"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
var user = require('./Script/Api/User');
var other = require('./Script/other');
var uploadFile = require('./Script/UploadFile');
var role = require('./Script/Api/Role');
var hello = require('./build/Hello');
var bodyParser = require('body-parser');
app.all('*', function (req, res, next) {
    console.log(new Date() + " : " + req.url);
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Credentials", true);
    // res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    //res.header("Content-Type", "application/json;charset=utf-8");
    //res.header("Content-Type", "image/png");
    next();
});
//json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/** 共享public文件夹 */
app.use(express_1.default.static('public'), function (req, res, next) {
    next();
});
app.use('/user', user);
app.use('/role', role);
app.use('/other', other);
app.use('/upload', uploadFile);
app.use('/hello', hello);
app.get("/", function (request, response) {
    response.send("hello world");
});
app.get("/uploadScore", function (request, response) {
    console.log("访问了/uploadScore");
    console.log(request.query);
    response.send("Success");
});
let server = app.listen(3000, () => {
    console.log(new Date());
    console.log("Server is begin at port:" + server.address());
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
var bodyParser = require('body-parser'); // body json 解析
var hello = require('./Script/Api/Hello');
var user = require('./Script/Api/User');
var dept = require('./Script/Api/Dept');
var role = require('./Script/Api/Role');
var module_route = require('./Script/Api/Module');
var flow = require('./Script/Api/Flow');
var userInfo = require('./Script/Api/UserInfo');
var vote = require('./Script/Api/Vote');
var doc = require('./Script/Api/Doc');
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
app.use('/hello', hello);
app.use('/user', user);
app.use('/dept', dept);
app.use('/role', role);
app.use('/module', module_route);
app.use('/flow', flow);
app.use('/userInfo', userInfo);
app.use('/vote', vote);
app.use('/doc', doc);
app.get("/", function (request, response) {
    response.send("hello world");
});
// app.engine('handlebars', handlebars.engine); // 将express模板引擎配置成handlebars 
// app.set('view engine', 'handlebars');
// view engine setup
app.set('views', './public/web');
app.set('view engine', 'ejs');
app.get("/index", function (req, res) {
    res.render('index');
});
app.get("/uploadScore", function (request, response) {
    console.log("访问了/uploadScore");
    console.log(request.query);
    response.send("Success");
});
let server = app.listen(3000, () => {
    console.log(new Date());
    console.log("Server is begin at port:" + server.address().port);
});
const ws_1 = __importDefault(require("ws"));
console.log("开始建立连接..." + new Date());
const wss = new ws_1.default.Server({
    port: 3001,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        // Other options settable:
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        serverMaxWindowBits: 10,
        // Below options specified as default values.
        concurrencyLimit: 10,
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed.
    }
});
wss.on('connection', function connection(socket, request) {
    console.log(socket + "is connection");
    console.log(request.headers);
    socket.on('message', function incoming(message) {
        console.log('received: %s', message);
    });
    socket.on('close', function close(code, reason) {
        console.log('close: ' + code + " reason: " + reason);
    });
    socket.on('open', function open() {
        console.log('open');
    });
    socket.on('error', function error(err) {
        console.log(err);
    });
    socket.send('11111');
});
console.log("建立连接完成" + new Date());

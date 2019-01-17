import express from 'express';
import net from 'net'

const app = express();

var bodyParser = require('body-parser');  // body json 解析


var hello = require('./Script/Api/Hello');
var user = require('./Script/Api/User');
var dept = require('./Script/Api/Dept');
var role = require('./Script/Api/Role');
var module_route = require('./Script/Api/Module');
var flow = require('./Script/Api/Flow');
var userInfo = require('./Script/Api/UserInfo')





app.all('*', function(req, res, next) {
    console.log( new Date() + " : " + req.url);
    
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
app.use(bodyParser.urlencoded({extended: false}));


/** 共享public文件夹 */
app.use(express.static('public'),function(req, res, next) {
    next();
});


app.use('/hello',hello);
app.use('/user',user);
app.use('/dept',dept);
app.use('/role',role);
app.use('/module',module_route);
app.use('/flow',flow);
app.use('/userInfo',userInfo);




app.get("/",function (request , response) {
    
    response.send("hello world");
});

app.get("/uploadScore", function (request , response) {
    console.log("访问了/uploadScore");
    console.log(request.query);
    
    response.send("Success");
});




let server = app.listen(3000 , ()=>{
    console.log(new Date());
    console.log("Server is begin at port:" + (<net.AddressInfo>server.address()).port);
});

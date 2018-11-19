
var express = require('express')
var app = express()
var user = require('./Script/User')
var other = require('./Script/other')
var uploadFile = require('./Script/UploadFile')

var pool = require('./Script/DBConfig')


app.all('*', function(req, res, next) {
    console.log(req.url);
    
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Credentials", true);
    // res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Headers", "Content-Type");
    //res.header("Content-Type", "application/json;charset=utf-8");
    //res.header("Content-Type", "image/png");
    next();
});

/** 共享public文件夹 */
app.use(express.static('public'),function(req, res, next) {
    next();
});

app.use('/user', user);
app.use('/other',other);
app.use('/upload',uploadFile);

app.get("/",function (request , response) {
    pool.getConnection(function(err, connection){
        if (err) {
            console.log("46" + err);
        } else {
            connection.query(userSql.selectAll, function (err, result) {
                if (err) {
                    console.log("54" + err);
                } else {
                    console.log(result);
                }
            })
        }
    })
    response.send("hello world");
});

app.get("/uploadScore", function (request , response) {
    console.log("访问了/uploadScore");
    console.log(request.query);
    
    response.send("Success");
});

server = app.listen(3000 , ()=>{
    console.log("Server is begin at port:" + server.address().port);
});






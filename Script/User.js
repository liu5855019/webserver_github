// user.js - user route module.

var express = require('express');
var router = express.Router();

var pool = require('./DBConfig');

var userSql = {
    insert : 'INSERT INTO user(username,password) VALUES(?,?)',
    selectAll : 'SELECT * FROM user',
    selectUsername : 'SELECT * FROM user WHERE username = ?',
}


router.get('/userList', function (req, res) {
    pool.getConnection(function(err, connection){
        if (err) {
            console.log('link_err');
            res.send(500,'link_err');
        } else {
            connection.query(userSql.selectAll, function (err, result) {
                if (err) {
                    res.send(500,'select error');
                } else {
                    res.send(result);
                }
            })
        }
    })
})

/** 注册用户 */
router.get('/register', function (req , res) {
    console.log(req.query);
    
    var username = req.query.username;
    var password = req.query.password;

    pool.getConnection(function (err,connection) {
        if (err) {
            res.send(500,'link error');
        } else {
            connection.query(userSql.selectUsername , username , function (err,result) {
                if (err) {
                    console.log(err);
                    res.send(500,'select err');
                } else {
                    if (result.length) {
                        res.send('{"desc":"this user is exist"}');
                    } else {
                        connection.query(userSql.insert,[username,password], function (err, result) {
                            if (err) {
                                console.log(err);
                                res.send(500,'register error');
                            } else {
                                console.log(result);
                                
                                res.send({
                                    username:req.query.username,
                                    password:req.query.password
                                })
                            }
                        })
                    }
                }
            })
        }
    });
})


// About page route.
router.get('/about', function (req, res) {
  console.log("访问了/user/about");
  res.send('{"user":"aaa"}');
})

module.exports = router;


var mysql = require('mysql');

var config = {
    host: '47.105.171.135',         // 主机名
    user: 'root',                   // 用户名
    password: '854623123',          // 密码
    database: 'animal_chess',       // 数据库名 
    port: '3306'                    // 端口号（默认都是3306）
}

var pool = mysql.createPool(config);

module.exports = pool;




    



  









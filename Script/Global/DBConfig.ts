
import * as mysql from 'mysql';

let config : mysql.PoolConfig  = {
    host: '47.105.171.135',         // 主机名
    user: 'root',                   // 用户名
    password: '854623123',          // 密码
    database: 'animal_chess',       // 数据库名 
    port: 3306                    // 端口号（默认都是3306）
}




// export function db(sql: string, arg: any, callback?: any) {
//     // 1.创建连接
//     const config = mysql.createConnection({
//         host: 'localhost', // 数据库地址
//         user: 'root', // 数据库名
//         password: 'root', // 数据库密码
//         port: 3306, // 端口号
//         database: 'cms' // 使用数据库名字
//     });
//     // 2.开始连接数据库
//     config.connect();
//     // 3.封装对数据库的增删改查操作
//     config.query(sql, arg, (err:any, data:any) => {
//         callback(err, data);
//     });
//     // 4.关闭数据库
//     config.end();
// }


export let pool = mysql.createPool(config); 






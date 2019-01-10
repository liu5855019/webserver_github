import { PoolConnection } from "mysql";


export class Project {
    constructor() {
    }
    static getuser(req:any , connection:PoolConnection , res:any , callback:(user:any)=>void) {

        let token = req.headers.token;

        connection.query('SELECT * FROM account WHERE token = ?',token,function (err,result) {
            if (err) {
                res.send(500,err);
                return;
            } 
            if (result.length) {
                let user = result[0];
                let date = user.token_time;
                let now = new Date();
                
                if (date.getTime() > now.getTime()) {
                    callback(user);
                } else {
                    res.send({
                        "code":401,
                        "msg":"This token is not exist or overdue",
                        "obj":{}
                    });
                }
            } else {
                res.send({
                    "code":401,
                    "msg":"This token is not exist or overdue",
                    "obj":{}
                });
            }
        })
    }
}




import * as express from 'express';
import { IRoute, Router } from 'express-serve-static-core';
let router:Router = express.Router();

//import { pool } from "../Global/DBConfig";


router.get("/hello",function (req,res) {
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
    
})

module.exports = router;


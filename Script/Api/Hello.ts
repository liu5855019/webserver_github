

import * as express from 'express';
import { IRoute, Router } from 'express-serve-static-core';
let router:Router = express.Router();

import {pool}  from "../Global/DBConfig";


router.get("/hello",function (req,res) {
    let query = req.query;

    console.log('aaaaaaaaa');
    

    pool.getConnection(function(err, connection) {
        
        if (err) {
            console.log(err);
            
            res.status(500).send(err);
            
           
        } else {
            res.send({
                "aaa":connection
            });
        }
    });
    
})

module.exports = router;


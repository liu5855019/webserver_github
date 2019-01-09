

import * as express from 'express';
import { IRoute, Router } from 'express-serve-static-core';
let router:Router = express.Router();


router.get("/hello",function (req,res) {
    let query = req.query;

    console.log(query);
    
})

module.exports = router;


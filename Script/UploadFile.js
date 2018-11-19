

var fs = require('fs');
var express = require('express');

 
var router = express.Router();

router.post('/',function (req,res) {
    console.log(req);  // 上传的文件信息
 
    res.send('{result:success!}')
    // var des_file = "./upload/" + req.files[0].originalname;
    // fs.readFile( req.files[0].path, function (err, data) {
    //     fs.writeFile(des_file, data, function (err) {
    //         if( err ){
    //              console.log( err );
    //         }else{
    //             response = {
    //                 message:'File uploaded successfully',
    //                 filename:req.files[0].originalname
    //             };
    //             console.log( response );
    //             res.end( JSON.stringify( response ) );
    //         }
    //     });
    // });
})
 
module.exports = router;









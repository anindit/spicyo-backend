const router = require('express').Router();
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
var session = require('express-session');
require("dotenv").config();
const path = require("path");
const multer = require("multer");
const sqlcon = require("../../db.js");
const authController=require('../../controller/authController');

const storage = multer.diskStorage({
   destination: "./public/myprofile_images/",
   filename: function(req, file, cb){
      cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
   }
});

var upload = multer({ storage: storage })

router.get('/', (req, res) => {
  res.send('In all user page')
})
router.post('/upload', upload.single('myImage'), (req, res, next) => {
   const file = req.file;
   console.log(file)
   var updateusername=req.body.updateusername;
   var userid=req.body.userid;
   var filenames=file.filename;

   if (!file) {
     const error = new Error('Please upload a file')
     error.httpStatusCode = 400
     return next(error)
   }

   var sql_update = "Update user set username='"+updateusername+"', profileimage='"+filenames+"' where id="+userid;
   sqlcon.query(sql_update, function (err, result) {
      if (err) throw err;
      console.log("1 record updated");

      if(result)
      {
         response = {            
            msg:'Profile updated successfully!',
            status:1
         };
         res.send(response);
      }
      else{
         response = {            
            msg:'Unable to update profile!',
            status:0
         };
         res.send(response);
      }
   });
    
   
 })



 router.post("/login", (req, res) => {
  //console.log(req.body.username);
  var username=req.body.username;
  var password=req.body.password;
  //const passwordHash = bcrypt.hashSync(password, 10);
  console.log('---cur hash---'+username) 
  var response=[];

     
   var sql_username_select = "select * from user where username='"+username+"'";
   console.log(sql_username_select)
      sqlcon.query(sql_username_select, function (err, result) {
        // console.log('-----'+err)
         if (err){
            res.end({err:err});
         }
         var length = Object.keys(result).length;
         if(length>0)
         {
            bcrypt.compare(password,result[0].password,(error,responses)=>{
               if(responses)
               {
                 var allres=result[0];
                 var token=jwt.sign({allres},process.env.SECRET_KEY,{
                    expiresIn: 86400 // expires in 24 hours
                 });
                 //req.session.user=result[0];
                 //console.log(req.session.user)
                 response = {          
                    msg:'User logged in successfully!',
                    result:result,
                    token:token,
                    status:1
                 };
                 res.send(response);
               }
               else{
                 response = {          
                    msg:'Wrong username/password combination!',
                    status:0
                 };
                 res.send(response);

               }
            })
           
         }
         else{
            response = {
         
               msg:'Username does not exists!',
               status:0
            };
            res.send(response);
         }
         
         
      });
      
});

router.post("/myprofile", (req, res) => {
  var userid=req.body.userid;
  var response=[];
     
   var sql_username_select = "select * from user where id='"+userid+"'";
   console.log(sql_username_select)
      sqlcon.query(sql_username_select, function (err, result) {
        // console.log('-----'+err)
         if (err){
            res.end({err:err});
         }
         var length = Object.keys(result).length;
         if(length>0)
         {
            response = {          
                msg:'Profile details are below!',
                result:result[0],
                status:1
            };
            res.send(response);
           
         }
         else{
            response = {
         
               msg:'Profile is invalid!',
               status:0
            };
            res.send(response);
         }
         
         
      });
      
});

module.exports=router;

const router = require('express').Router();
var bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
var session = require('express-session');
require("dotenv").config();
const path = require("path");
const multer = require("multer");
const mailgun = require("mailgun-js");

const DOMAIN = "sandbox1daa614766ea41718bc2f6e307ce04a6.mailgun.org";
const mg = mailgun({apiKey: "cc666c7c8ba926a2ceea014fbf6cbb2f-b6190e87-450d4550", domain: DOMAIN});
const sqlcon = require("../db.js");

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

router.post('/register', function(req, res) {
  console.log(req.username);
  var username=req.body.username;
  var email=req.body.email;
  var password=req.body.password;
  const passwordHash = bcrypt.hashSync(password, 10);
   console.log('---cur hash---'+passwordHash) 

   var select_sql_user="SELECT * FROM user WHERE username ='"+username+"'";
   sqlcon.query(select_sql_user, function (err1, result1) {
      if (err1){
         res.send({err:err1});
      }

      var test = result1;
      var length = Object.keys(result1).length;

      if(length>0)
      {
         response = {            
            msg:'User already exists with this username!',
            status:0
         };
         res.send(response);
      }
      else{
         var select_sql_email="SELECT * FROM user WHERE email ='"+email+"'";
         sqlcon.query(select_sql_email, function (err2, result2) {
            if (err2){
               res.send({err:err2});
            }
            var test = result2;
            var length1 = Object.keys(result2).length;

            if(length1>0)
            {
               response = {            
                  msg:'User already exists with this email!',
                  status:0
               };
               res.send(response);
            }
            else{

                  var sql_insert = "INSERT INTO user (username, email,	password) VALUES ('"+username+"', '"+email+"', '"+passwordHash+"')";
                  sqlcon.query(sql_insert, function (err, result) {
                     if (err){
                        res.send({err:err});
                     }

                     if(result)
                     {
                        response = {
                     
                           msg:'User created successfully!',
                           status:1
                        };
                     }
                     else{
                        response = {
                     
                           msg:'Problem in creating user!',
                           status:0
                        };
                     }
                     
                     res.send(response);
                  });
            }
         });

      }
   
   });
    
 });

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
                 req.session.user=result;
                 console.log('---ello----')
                 console.log(result[0])
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

router.post('/logout',function(req,res){    
   req.session.destroy(function(err){  
       if(err){  
           console.log(err);  
       }  
       else  
       {  
         response = {
         
            msg:'User logged out successfully!!',
            status:1
         };
         res.send(response);
       }  
   });  
 
 });


 router.post("/forgetpassword", (req, res) => {
   //console.log(req.body.username);
   var forgetemail=req.body.forgetemail;

   
   var response=[];
 
      
    var sql_username_select = "select * from user where email='"+forgetemail+"'";
    console.log(sql_username_select)
       sqlcon.query(sql_username_select, function (err, result) {
         // console.log('-----'+err)
          if (err){
             res.end({err:err});
          }
          var length = Object.keys(result).length;
          if(length>0)
          {
             console.log(result[0].id)
               var token=jwt.sign({id:result[0].id},process.env.SECRET_KEY,{
                  expiresIn: '20m' // expires in 24 hours
               });

               var sql_insert = "Update user set resetlink='"+token+"' where id="+result[0].id;
               sqlcon.query(sql_insert, function (err, result) {
                  if (err){
                     res.send({err:err});
                  }

                  const data = {
                     from: "Mailgun Sandbox <postmaster@sandbox1daa614766ea41718bc2f6e307ce04a6.mailgun.org>",
                     to: "aninditadas1220@gmail.com",
                     subject: "Hello",
                     html: `<p>Click on the below ink</p><br/><a href="http://localhost:3000/resetpassword/${token}">http://localhost:3000/resetpassword/${token}</a>`
                  };
                  mg.messages().send(data, function (error, body) {
                     console.log(body);
                  });

               });            
          }
          else{
             response = {
          
                msg:'Email does not exists!',
                status:0
             };
             res.send(response);
          }
          
          
       });
       
 });

 router.post("/resetlink", (req, res) => {
   //console.log(req.body.username);
   var resetlink=req.body.resetlink;
   var password=req.body.password;
   console.log('---resetlink--'+resetlink)
   console.log('---password--'+password);
   if(resetlink)
   {
      jwt.verify(resetlink, process.env.SECRET_KEY, (err, verifiedJwt) => {
         if(err){
            console.log(err)
            response = {
          
               msg:err.message,
               status:0
            };
            res.send(response);
         }else{
            console.log(verifiedJwt.id);
            var userid=verifiedJwt.id;
            const passwordHash = bcrypt.hashSync(password, 10);
            var sql_update = "Update user set password='"+passwordHash+"' where id="+userid;
            sqlcon.query(sql_update, function (err, result) {
               if (err) throw err;
               console.log("1 record updated");

               if(result)
               {
                  response = {            
                     msg:'Password updated successfully!',
                     status:1
                  };
                  res.send(response);
               }
               else{
                  response = {            
                     msg:'Unable to update password!',
                     status:0
                  };
                  res.send(response);
               }
            });
         }
       })
   }
   else{
      response = {
          
         msg:'Authentication error!',
         status:0
      };
      res.send(response);
   }
 })
 
module.exports=router;

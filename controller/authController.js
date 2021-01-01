const sqlcon = require("../db.js");
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
exports.register=(req,res)=>{
  console.log(req.body)
  
  const {username,email,password,confpassword}=req.body;
  const passwordHash = bcrypt.hashSync(password, 10);
  var select_sql_user="SELECT * FROM user WHERE username ='"+username+"'";
  sqlcon.query(select_sql_user, function (err1, result1) {
    if (err1){
       res.send({err:err1});
    }

    var test = result1;
    var length = Object.keys(result1).length;

    if(length>0)
    {
      
       return res.render('register',{
        layout: 'other',
         message:'This username is already exists.'
       });
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
            return res.render('register',{
              layout: 'other',
              message:'This email is already exists.'
            });
          }
          else{

            if(password !=confpassword)
            {
              return res.render('register',{
                layout: 'other',
                message:'Password and confirm password does not match.'
              }); 
            }
            else{
                var sql_insert = "INSERT INTO user (username, email,	password) VALUES ('"+username+"', '"+email+"', '"+passwordHash+"')";
                sqlcon.query(sql_insert, function (err, result) {
                   if (err){
                      res.send({err:err});
                   }

                   if(result)
                   {
                      return res.render('register',{
                        layout: 'other',
                        message:'User created successfully.'
                      }); 
                   }
                   else{
                      return res.render('register',{
                        layout: 'other',
                        message:'Problem in creating user.'
                      }); 
                   }
                   
                   res.send(response);
                });
              }
          }
       });

    }
 
 })
}

exports.login=async (req,res)=>{
  const {email,password}=req.body;
  if(!email || !password)
  {
    return res.render('login',{
      layout: 'other',
      message:'Problem in login.'
    }); 
  }
  else{

    var sql_username_select = "select * from user where email='"+email+"'";
    console.log(sql_username_select)
       sqlcon.query(sql_username_select, function (err, result) {
         // console.log('-----'+err)
          if (err){
             res.end({err:err});
          }
          var length = Object.keys(result).length;
          if(length>0)
          {
            if(result[0].usertype==1)
            {
                bcrypt.compare(password,result[0].password,(error,responses)=>{
                    if(responses)
                    {
                      var allres=result[0];
                      var token=jwt.sign({allres},process.env.SECRET_KEY,{
                        expiresIn: 86400 // expires in 24 hours
                      });
                      req.session.user=result[0];
                      req.session.token=token;
                      req.session.isloggedin=1;
                      console.log('==========')
                      console.log(req.session.user)
                      console.log(req.session.isloggedin)
                      console.log('==========')
                      res.redirect('/admin/home');

                    
                    }
                    else{
                      return res.render('login',{
                        layout: 'other',
                        message:'Wrong credentials!.'
                      }); 
    
                    }
                })
              }
              else{
                return res.render('login',{
                  layout: 'other',
                  message:'You are not allowed for this action!.'
                }); 
              }
            
          }
          else{
            return res.render('login',{
              layout: 'other',
              message:'Email does not exists!.'
            }); 
          }
          
          
       })

  }
}
exports.myprofileget=async (req,res)=>{
  let user=req.session.user;
  if(user)
  {
    var sql_username_select = "select * from user where id='"+user.id+"'";
    console.log(sql_username_select)
    sqlcon.query(sql_username_select, function (err, result) {

    return res.render('myprofile',{
      userdetails:result[0],
      isloggedin:true
    }); 
    })

  }
  else{
    res.redirect('/admin/login')
  }
}
const storage = multer.diskStorage({
  destination: "./public/myprofile_images/",
  filename: function(req, file, cb){
     cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

var upload = multer({ storage: storage,
  fileFilter: function (req, file, callback) 
  {
      var ext = path.extname(file.originalname);
      if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
          return callback(new Error('Only images are allowed'))
      }
      callback(null, true)
  },
  limits:{
      fileSize: 1024 * 1024
  } }).single('myImage');

exports.myprofile=async (req,res)=>{
  
  upload(req,res,(err)=>{
    console.log('multer')
    console.log(req.body)
    if(err){
      return res.render('myprofile',{
        message:err
      }); 
    }
    else{
      const {userid,previmage,email}=req.body;
      var sql_username_select = "select * from user where email='"+email+"' and id!='"+userid+"'";
      console.log(sql_username_select)
      sqlcon.query(sql_username_select, function (err, result) {
      if(result.length>0)
      {
        var sql_data_select = "select * from user where id='"+userid+"'";
        console.log(sql_data_select)
          sqlcon.query(sql_data_select, function (err, results) {

            return res.render('myprofile',{
              message:'This email already in use.',
              userdetails:results[0]
            }); 
          })
       
      }
      else{
          //console.log(path.join(__dirname,'../public/myprofile_images/'+previmage))   
          if(previmage && req.file !==undefined)
          {

            let imagepath=path.join(__dirname,'../public/myprofile_images/'+previmage);
              if (fs.existsSync(imagepath)) {
                fs.unlinkSync(imagepath);
              }

          }
          if(req.file !==undefined)
          {
            var filenames=req.file.filename;
          }
          else{
            var filenames=previmage;
          }
          var sql_update = "Update user set email='"+email+"', profileimage='"+filenames+"' where id="+userid;
          sqlcon.query(sql_update, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
      
            if(result)
            {
              var sql_username_select = "select * from user where email='"+email+"'";
              console.log(sql_username_select)
                sqlcon.query(sql_username_select, function (err, result) {
                  req.session.user=result[0];

                  return res.render('myprofile',{
                    message:'Updated data',
                    userdetails:req.session.user,
                    isloggedin:true
                  }); 
                })
              
            }
            else{
              return res.render('myprofile',{
                message:'Unable to update profile'
              }); 
            }
          });
        }
     
      })
            
    }
  })
  
}





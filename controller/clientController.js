const sqlcon = require("../db.js");
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require('fs');



exports.allClient=async (req,res)=>{
  var sql_recipe_select = "select user.*,count(clients_posts.id) as tot_post from user left join clients_posts on user.id=clients_posts.userid group by user.id";
     sqlcon.query(sql_recipe_select, function (err, result) {
      if(err) throw err;
     
      return res.render('client/client',{
        message:'Updated data',
        allclient:result,
      }); 
     })

}
exports.addclientget=async (req,res)=>{
  let user=req.session.usclienter;
  if(user)
  {
    res.render('client/addclient.hbs',{
      btitle:'Add Client',
    })
  }
  else{
    res.redirect('/admin/login')
  }
}

const storage1 = multer.diskStorage({
  destination: "./public/myprofile_images/",
  filename: function(req, file, cb){
     cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
  }
});

var upload1 = multer({ 
  storage: storage1,
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
  }
 }).single('clientImage');
exports.addclient=async (req,res)=>{
  

  upload1(req,res,(err)=>{
    console.log('multer')
    console.log(req.body)
    console.log(req.file)
    if(err){
      return res.render('client/addclient',{
        message:err
      }); 
    }
    else{
      const {clientid,prevclientimage,uname,uemail}=req.body;
      //console.log(path.join(__dirname,'../public/myprofile_images/'+previmage))   
     
      if(req.file !==undefined)
      {
        var filenames=req.file.filename;
      }
      else{
        var filenames=prevclientimage;
      }
      
      if(clientid !=0)
      {
        //check for same email
        var sql_email_select = "select * from user where email='"+uemail+"' and id !="+clientid;
          // console.log(sql_username_select)
          sqlcon.query(sql_email_select, function (err, resultemail) {
            console.log(resultemail[0])
            if(err) throw err;
            if(resultemail.length>0)
            {
             
              var sql_banner_select = "select * from user where id="+clientid;
              // console.log(sql_username_select)
                  sqlcon.query(sql_banner_select, function (err, result) {
                    console.log(result[0])
                   if(err) throw err;
                   return res.render('client/addclient',{
                     btitle:'Edit Client',
                     message:'This email already exists!',
                     clientdetails:result[0]
                   }); 
                  })
              
            }
            else{
                //check for same username
                var sql_user_select = "select * from user where username='"+uname+"' and id !="+clientid;
                // console.log(sql_username_select)
                sqlcon.query(sql_user_select, function (err, resultuser) {
                  console.log(resultuser[0])
                  if(err) throw err;
                  if(resultuser.length>0)
                  {
                    var sql_banner_select = "select * from user where id="+clientid;
                  // console.log(sql_username_select)
                      sqlcon.query(sql_banner_select, function (err, result) {
                        console.log(result[0])
                      if(err) throw err;
                      return res.render('client/addclient',{
                        btitle:'Edit Client',
                        message:'This username already exists!',
                        clientdetails:result[0]
                      }); 
                      })
                  }
                  else{

                      //update here after checking
                      if(prevclientimage && req.file !==undefined)
                      {
                        let imagepath=path.join(__dirname,'../public/myprofile_images/'+prevclientimage);
                        if (fs.existsSync(imagepath)) {
                          fs.unlinkSync(imagepath);
                        }
                
                      }
                        var sql_update = "Update user set username='"+uname+"',	email='"+uemail+"', profileimage='"+filenames+"' where id="+clientid;
                        sqlcon.query(sql_update, function (err, result) {
                          if (err) throw err;
                          console.log("1 record updated");
                    
                          if(result)
                          {
                            var sql_banner_select = "select * from user where id="+clientid;
                            // console.log(sql_username_select)
                                sqlcon.query(sql_banner_select, function (err, result) {
                                  console.log(result[0])
                                if(err) throw err;
                                return res.redirect('/admin/editclient/'+clientid); 
                                })
                                
                          }
                          else{
                            return res.render('client/addclient',{
                              message:'Unable to update client'
                            }); 
                          }
                        });

                  }
                  
                })

            }
            
          })

        
        }
        else{
            var sql_insert = "INSERT INTO user (username, email,profileimage) VALUES ('"+uname+"', '"+uemail+"', '"+filenames+"')";
            sqlcon.query(sql_insert, function (err, result) {
              if (err){
                  res.send({err:err});
              }

              if(result)
              {
                  return res.redirect('/admin/client'); 
              }
              else{
                  return res.render('client/addclient',{
                    message:'Problem in creating client.'
                  }); 
              }
              
              res.send(response);
            });
        }
      
    }
  })

}


exports.editclient=async (req,res)=>{
  var userid=req.params.id;
  console.log(req.baseUrl)
  var sql_banner_select = "select * from user where id="+userid;
 // console.log(sql_username_select)
     sqlcon.query(sql_banner_select, function (err, result) {
       console.log(result[0])
      if(err) throw err;
      return res.render('client/addclient',{
        btitle:'Edit Client',
        clientdetails:result[0]
      }); 
     })

}

exports.deleteclient=async (req,res)=>{
  var clientid=req.params.id;
  console.log(clientid)

  var sql_banner_select = "select * from user where id="+clientid;
  // console.log(sql_username_select)
      sqlcon.query(sql_banner_select, function (err, result) {
        console.log(result[0])
       if(err) throw err;
       let prevbannerimage=result[0].profileimage;
       if(prevbannerimage)
        {
          let imagepath=path.join(__dirname,'../public/myprofile_images/'+prevbannerimage);
          if (fs.existsSync(imagepath)) {
            fs.unlinkSync(imagepath);
          }
  
        }
        var sql_u_select = "delete from user where id="+clientid;
        // console.log(sql_username_select)
            sqlcon.query(sql_u_select, function (err, result) {
              console.log(result[0])
             if(err) throw err;
             return res.redirect('/admin/client'); 
            })
      })
 

}



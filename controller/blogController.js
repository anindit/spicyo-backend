const sqlcon = require("../db.js");
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
var moment = require('moment');



exports.allBlog=async (req,res)=>{
  var sql_recipe_select = "select * from blog where 1";
 // console.log(sql_username_select)
     sqlcon.query(sql_recipe_select, function (err, result) {
//console.log(result)
      if(err) throw err;
      return res.render('blog/blog',{
        message:'Updated data',
        allblogs:result,
      }); 
     })

}
exports.addblogget=async (req,res)=>{
  let user=req.session.user;
  if(user)
  {
    res.render('blog/addblog.hbs',{
      btitle:'Add Blog',
    })
  }
  else{
    res.redirect('/admin/login')
  }
}

const storage1 = multer.diskStorage({
  destination: "./public/blog_images/",
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
 }).single('blogImage');

exports.addblog=async (req,res)=>{
  

  upload1(req,res,(err)=>{
    console.log('multer')
    console.log(req.body)
    console.log(req.file)
    if(err){
      return res.render('blog/addblog',{
        message:err
      }); 
    }
    else{
      const {blogid,prevblogimage,bname,blogdesc}=req.body;
      //console.log(path.join(__dirname,'../public/myprofile_images/'+previmage))   
     
      if(req.file !==undefined)
      {
        var filenames=req.file.filename;
      }
      else{
        var filenames=prevblogimage;
      }
      
      if(blogid !=0)
      {
        if(prevblogimage && req.file !==undefined)
        {
          let imagepath=path.join(__dirname,'../public/blog_images/'+prevblogimage);
          if (fs.existsSync(imagepath)) {
            fs.unlinkSync(imagepath);
          }
  
        }
          var sql_update = "Update blog set name='"+bname+"',	description='"+blogdesc+"', blog_img='"+filenames+"' where id="+blogid;
          sqlcon.query(sql_update, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
      
            if(result)
            {
              var sql_banner_select = "select * from blog where id="+blogid;
              // console.log(sql_username_select)
                  sqlcon.query(sql_banner_select, function (err, result) {
                    console.log(result[0])
                   if(err) throw err;
                   return res.redirect('/admin/editblog/'+blogid); 
                  })
                  
            }
            else{
              return res.render('blog/addblog',{
                message:'Unable to update blog'
              }); 
            }
          });
        }
        else{
            var createdon=moment().format('YYYY-MM-DD');
            console.log('---createdon---'+createdon)
            var sql_insert = "INSERT INTO blog (name, description,blog_img,createdon) VALUES ('"+bname+"', '"+blogdesc+"', '"+filenames+"', '"+createdon+"')";
            sqlcon.query(sql_insert, function (err, result) {
              if (err){
                  res.send({err:err});
              }

              if(result)
              {
                  return res.redirect('/admin/blog'); 
              }
              else{
                  return res.render('blog/addblog',{
                    message:'Problem in creating blog.'
                  }); 
              }
              
              res.send(response);
            });
        }
      
    }
  })

}


exports.editblog=async (req,res)=>{
  var blogid=req.params.id;
  console.log(req.baseUrl)
  var sql_banner_select = "select * from blog where id="+blogid;
 // console.log(sql_username_select)
     sqlcon.query(sql_banner_select, function (err, result) {
       console.log(result[0])
      if(err) throw err;
      return res.render('blog/addblog',{
        btitle:'Edit Blog',
        blogdetails:result[0]
      }); 
     })

}

exports.deleteblog=async (req,res)=>{
  var blogid=req.params.id;
  console.log(blogid)

  var sql_banner_select = "select * from blog where id="+blogid;
  // console.log(sql_username_select)
      sqlcon.query(sql_banner_select, function (err, result) {
        console.log(result[0])
       if(err) throw err;
       let prevbannerimage=result[0].blog_img;
       if(prevbannerimage)
        {
          let imagepath=path.join(__dirname,'../public/blog_images/'+prevbannerimage);
          if (fs.existsSync(imagepath)) {
            fs.unlinkSync(imagepath);
          }
  
        }
        var sql_u_select = "delete from blog where id="+blogid;
        // console.log(sql_username_select)
            sqlcon.query(sql_u_select, function (err, result) {
              console.log(result[0])
             if(err) throw err;
             return res.redirect('/admin/blog'); 
            })
      })
 

}



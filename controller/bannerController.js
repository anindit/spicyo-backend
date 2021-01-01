const sqlcon = require("../db.js");
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require('fs');




const storage1 = multer.diskStorage({
  destination: "./public/banner_images/",
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
 }).single('bannerImage');
exports.addbanner=async (req,res)=>{
  

  upload1(req,res,(err)=>{
    console.log('multer')
    console.log(req.body)
    console.log(req.file)
    if(err){
      return res.render('addbanner',{
        message:err
      }); 
    }
    else{
      const {bannerid,prevbannerimage,title,desc}=req.body;
      //console.log(path.join(__dirname,'../public/myprofile_images/'+previmage))   
     
      if(req.file !==undefined)
      {
        var filenames=req.file.filename;
      }
      else{
        var filenames=prevbannerimage;
      }
      
      if(bannerid !=0)
      {
        if(prevbannerimage && req.file !==undefined)
        {
          let imagepath=path.join(__dirname,'../public/banner_images/'+prevbannerimage);
          if (fs.existsSync(imagepath)) {
            fs.unlinkSync(imagepath);
          }
  
        }
          var sql_update = "Update banner set title='"+title+"',description='"+desc+"', banimage='"+filenames+"' where id="+bannerid;
          sqlcon.query(sql_update, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
      
            if(result)
            {
              var sql_banner_select = "select * from banner where id="+bannerid;
              // console.log(sql_username_select)
                  sqlcon.query(sql_banner_select, function (err, result) {
                    console.log(result[0])
                   if(err) throw err;
                   return res.redirect('/admin/editbanner/'+bannerid); 
                  })
                  
            }
            else{
              return res.render('addbanner',{
                message:'Unable to update banner'
              }); 
            }
          });
        }
        else{
            var sql_insert = "INSERT INTO banner (title, description,banimage,status) VALUES ('"+title+"', '"+desc+"', '"+filenames+"',1)";
            sqlcon.query(sql_insert, function (err, result) {
              if (err){
                  res.send({err:err});
              }

              if(result)
              {
                  return res.redirect('/admin/banner'); 
              }
              else{
                  return res.render('addbanner',{
                    message:'Problem in creating banner.'
                  }); 
              }
              
              res.send(response);
            });
        }
      
    }
  })

}

exports.allBanner=async (req,res)=>{
  var sql_banner_select = "select * from banner where 1";
 // console.log(sql_username_select)
     sqlcon.query(sql_banner_select, function (err, result) {
//console.log(result)
      if(err) throw err;
      return res.render('banner',{
        message:'Updated data',
        allbanners:result,
        isloggedin:req.session.isloggedin,
        type:'banner'
      }); 
     })

}
exports.editbanner=async (req,res)=>{
  var bannerid=req.params.id;
  console.log(req.baseUrl)
  var sql_banner_select = "select * from banner where id="+bannerid;
 // console.log(sql_username_select)
     sqlcon.query(sql_banner_select, function (err, result) {
       console.log(result[0])
      if(err) throw err;
      return res.render('addbanner',{
        btitle:'Edit Banner',
        bannerdetails:result[0]
      }); 
     })

}

exports.deletebanner=async (req,res)=>{
  var bannerid=req.params.id;
  console.log(bannerid)

  var sql_banner_select = "select * from banner where id="+bannerid;
  // console.log(sql_username_select)
      sqlcon.query(sql_banner_select, function (err, result) {
        console.log(result[0])
       if(err) throw err;
       let prevbannerimage=result[0].banimage;
       if(prevbannerimage)
        {
          let imagepath=path.join(__dirname,'../public/banner_images/'+prevbannerimage);
          if (fs.existsSync(imagepath)) {
            fs.unlinkSync(imagepath);
          }
  
        }
        var sql_u_select = "delete from banner where id="+bannerid;
        // console.log(sql_username_select)
            sqlcon.query(sql_u_select, function (err, result) {
              console.log(result[0])
             if(err) throw err;
             return res.redirect('/admin/banner'); 
            })
      })
 

}



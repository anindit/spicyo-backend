const sqlcon = require("../db.js");
var bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require('fs');



exports.allRecipe=async (req,res)=>{
  var sql_recipe_select = "select * from recipe where 1";
 // console.log(sql_username_select)
     sqlcon.query(sql_recipe_select, function (err, result) {
//console.log(result)
      if(err) throw err;
      return res.render('recipe/recipe',{
        message:'Updated data',
        allrecipes:result,
      }); 
     })

}
exports.addrecipeget=async (req,res)=>{
  let user=req.session.user;
  if(user)
  {
    res.render('recipe/addrecipe.hbs',{
      btitle:'Add Recipe',
    })
  }
  else{
    res.redirect('/admin/login')
  }
}

const storage1 = multer.diskStorage({
  destination: "./public/recipe_images/",
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
 }).single('recipeImage');
exports.addrecipe=async (req,res)=>{
  

  upload1(req,res,(err)=>{
    console.log('multer')
    console.log(req.body)
    console.log(req.file)
    if(err){
      return res.render('recipe/addrecipe',{
        message:err
      }); 
    }
    else{
      const {recipeid,prevrecipeimage,rname,rprice}=req.body;
      //console.log(path.join(__dirname,'../public/myprofile_images/'+previmage))   
     
      if(req.file !==undefined)
      {
        var filenames=req.file.filename;
      }
      else{
        var filenames=prevrecipeimage;
      }
      
      if(recipeid !=0)
      {
        if(prevrecipeimage && req.file !==undefined)
        {
          let imagepath=path.join(__dirname,'../public/recipe_images/'+prevrecipeimage);
          if (fs.existsSync(imagepath)) {
            fs.unlinkSync(imagepath);
          }
  
        }
          var sql_update = "Update recipe set recipyname='"+rname+"',	price='"+rprice+"', image='"+filenames+"' where id="+recipeid;
          sqlcon.query(sql_update, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
      
            if(result)
            {
              var sql_banner_select = "select * from recipe where id="+recipeid;
              // console.log(sql_username_select)
                  sqlcon.query(sql_banner_select, function (err, result) {
                    console.log(result[0])
                   if(err) throw err;
                   return res.redirect('/admin/editrecipe/'+recipeid); 
                  })
                  
            }
            else{
              return res.render('recipe/addrecipe',{
                message:'Unable to update recipe'
              }); 
            }
          });
        }
        else{
            var sql_insert = "INSERT INTO recipe (recipyname, price,image) VALUES ('"+rname+"', '"+rprice+"', '"+filenames+"')";
            sqlcon.query(sql_insert, function (err, result) {
              if (err){
                  res.send({err:err});
              }

              if(result)
              {
                  return res.redirect('/admin/recipe'); 
              }
              else{
                  return res.render('recipe/addrecipe',{
                    message:'Problem in creating recipe.'
                  }); 
              }
              
              res.send(response);
            });
        }
      
    }
  })

}


exports.editrecipe=async (req,res)=>{
  var recipeid=req.params.id;
  console.log(req.baseUrl)
  var sql_banner_select = "select * from recipe where id="+recipeid;
 // console.log(sql_username_select)
     sqlcon.query(sql_banner_select, function (err, result) {
       console.log(result[0])
      if(err) throw err;
      return res.render('recipe/addrecipe',{
        btitle:'Edit Recipe',
        recipedetails:result[0]
      }); 
     })

}

exports.deleterecipe=async (req,res)=>{
  var recipeid=req.params.id;
  console.log(recipeid)

  var sql_banner_select = "select * from recipe where id="+recipeid;
  // console.log(sql_username_select)
      sqlcon.query(sql_banner_select, function (err, result) {
        console.log(result[0])
       if(err) throw err;
       let prevbannerimage=result[0].image;
       if(prevbannerimage)
        {
          let imagepath=path.join(__dirname,'../public/recipe_images/'+prevbannerimage);
          if (fs.existsSync(imagepath)) {
            fs.unlinkSync(imagepath);
          }
  
        }
        var sql_u_select = "delete from recipe where id="+recipeid;
        // console.log(sql_username_select)
            sqlcon.query(sql_u_select, function (err, result) {
              console.log(result[0])
             if(err) throw err;
             return res.redirect('/admin/recipe'); 
            })
      })
 

}



const sqlcon = require("../db.js");
var bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
//const multer = require("multer");
const path = require("path");
const fs = require('fs');



exports.allreview=async (req,res)=>{
  var clientid=req.params.clientid;
  var sql_recipe_select = "select * from clients_posts where userid="+clientid;
     sqlcon.query(sql_recipe_select, function (err, result) {
      if(err) throw err;
     
      return res.render('review/review',{
        message:'Updated data',
        allreview:result
      }); 
     })

}




exports.addreview=async (req,res)=>{
 
      const {reviewid,desc}=req.body;
     console.log(req.body)
    if(reviewid !=0)
      {
       
        var sql_update = "Update clients_posts set description='"+desc+"' where id="+reviewid;
        sqlcon.query(sql_update, function (err, result) {
          if (err) throw err;
          console.log("1 record updated");
    
          if(result)
          {
            var sql_banner_select = "select * from clients_posts where id="+reviewid;
            // console.log(sql_username_select)
                sqlcon.query(sql_banner_select, function (err, result) {
                  console.log(result[0])
                if(err) throw err;
                return res.redirect('/admin/editreview/'+reviewid); 
                })
                
          }
          else{
            return res.render('review/addreview',{
              message:'Unable to update review'
            }); 
          }
        });
        
      }
      else{
          /*var sql_insert = "INSERT INTO clients_posts (description, userid) VALUES ('"+desc+"', '"+uemail+"', '"+filenames+"')";
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
          });*/
      }
      
 

}


exports.editreview=async (req,res)=>{
  var reviewid=req.params.id;
  console.log(req.baseUrl)
  var sql_banner_select = "select * from clients_posts where id="+reviewid;
 // console.log(sql_username_select)
     sqlcon.query(sql_banner_select, function (err, result) {
       console.log(result[0])
      if(err) throw err;
      return res.render('review/addreview',{
        btitle:'Edit Review',
        reviewdetails:result[0]
      }); 
     })

}

exports.deletereview=async (req,res)=>{
  var reviewid=req.params.id;
  var userid=req.params.userid;
  console.log(reviewid)

  var sql_banner_select = "delete from clients_posts where id="+reviewid;
  // console.log(sql_username_select)
      sqlcon.query(sql_banner_select, function (err, result) {
        console.log(result[0])
       if(err) throw err;
       res.redirect('/admin/review/'+userid);
      })
 

}

exports.approvereview=async (req,res)=>{
  var reviewid=req.params.id;
  var userid=req.params.userid;
  var status=req.params.status;
  console.log(reviewid)

  var sql_banner_select = "update clients_posts set status='"+status+"' where id="+reviewid;
  // console.log(sql_username_select)
      sqlcon.query(sql_banner_select, function (err, result) {
        console.log(result[0])
       if(err) throw err;
       res.redirect('/admin/review/'+userid);
      })
 

}



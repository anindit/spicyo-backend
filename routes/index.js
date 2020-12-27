const router = require('express').Router();
const sqlcon = require("../db.js");


router.get('/allpost', (req, res) => {
  console.log(1)
  var select_sql_all="SELECT clients_posts.id,clients_posts.createdon,clients_posts.description,user.username,user.profileimage from clients_posts inner join user on user.id=clients_posts.userid where clients_posts.status=1";
  sqlcon.query(select_sql_all, function (err1, result) {
    if (err1) throw err1;
    var test = result;
    var length = Object.keys(result).length;
    if(length>0)
    { 
        response = {   
            allpost:result,  
            msg:'Post lists are below.',
            status:1
        };
        res.send(response); 
      }
      else{
        response = {               
            msg:'No post is available.',
            status:0
        };
        res.send(response);
      }
    
  })
})

router.get('/recipelist', (req, res) => {
  console.log(1)
  var select_sql_all="SELECT * from recipe where status=1";
  sqlcon.query(select_sql_all, function (err1, result) {
    if (err1) throw err1;
    var test = result;
    var length = Object.keys(result).length;
    if(length>0)
    { 
        response = {   
            allrecipes:result,  
            msg:'Recipe lists are below.',
            status:1
        };
        res.send(response); 
      }
      else{
        response = {               
            msg:'No recipe is available.',
            status:0
        };
        res.send(response);
      }
    
  })
})

router.get('/bannerlist', (req, res) => {
  console.log(1)
  var select_sql_all="SELECT * from banner where status=1";
  sqlcon.query(select_sql_all, function (err1, result) {
    if (err1) throw err1;
    var test = result;
    var length = Object.keys(result).length;
    if(length>0)
    { 
        response = {   
            allbanner:result,  
            msg:'Banner lists are below.',
            status:1
        };
        res.send(response); 
      }
      else{
        response = {               
            msg:'No banner is available.',
            status:0
        };
        res.send(response);
      }
    
  })
})

router.get('/about', (req, res) => {
  console.log(1)
  var select_sql_all="SELECT * from about where status=1";
  sqlcon.query(select_sql_all, function (err1, result) {
    if (err1) throw err1;
    var test = result;
    var length = Object.keys(result).length;
    if(length>0)
    { 
        response = {   
            allabout:result,  
            msg:'About details are below.',
            status:1
        };
        res.send(response); 
      }
      else{
        response = {               
            msg:'No about detail is available.',
            status:0
        };
        res.send(response);
      }
    
  })
})

router.get('/blog', (req, res) => {
  console.log(1)
  var select_sql_all="SELECT * from blog where status=1 order by createdon desc limit 3 ";
  sqlcon.query(select_sql_all, function (err1, result) {
    if (err1) throw err1;
    var test = result;
    var length = Object.keys(result).length;
    if(length>0)
    { 
        response = {   
            allblog:result,  
            msg:'Blog details are below.',
            status:1
        };
        res.send(response); 
      }
      else{
        response = {               
            msg:'No about blog is available.',
            status:0
        };
        res.send(response);
      }
    
  })
})

router.get('/clientdetails', (req, res) => {
  
  var select_sql_all="SELECT clients_posts.*,user.username,user.profileimage from clients_posts inner join user on user.id=clients_posts.userid where status=1";
  console.log(select_sql_all)
  sqlcon.query(select_sql_all, function (err1, result) {
    if (err1) throw err1;
    var test = result;
    var length = Object.keys(result).length;
    if(length>0)
    { 
        response = {   
            allclient:result,  
            msg:'Clients details are below.',
            status:1
        };
        res.send(response); 
      }
      else{
        response = {               
            msg:'No client is available.',
            status:0
        };
        res.send(response);
      }
    
  })
})

router.post('/delete_post', function(req, res) {
 
  var postid=req.body.postid;
   console.log(req.body);
   if(postid !=0)
   {
    var sql_insert = "delete from clients_posts where id="+postid;
   }
   
   
   console.log(sql_insert)
   sqlcon.query(sql_insert, function (err, result) {
      if (err) throw err;
 
      if(result)
      {
       response = {
      
         msg:'Post deleted seccessfully!',
         status:1
      };
      }
      else{
       response = {
      
         msg:'Problem in deleting post!',
         status:0
      };
      }
      res.send(response);  
      console.log("1 record inserted");
   });
   //console.log(response);
 
   // Prepare output in JSON format
  
    
 });

router.post('/add_post', function(req, res) {
  var p_desc=req.body.p_desc;
  var userid=req.body.userid;
  var postid=req.body.postid;
  p_desc = p_desc.replace("'", "\\'")
   console.log(req.body);
   if(postid !=0)
   {
    var sql_insert = "Update clients_posts set description='"+p_desc+"' where id="+postid;
   }
   else{
    var sql_insert = "INSERT INTO clients_posts (userid,description) VALUES ('"+userid+"','"+p_desc+"')";
   }
   
   console.log(sql_insert)
   sqlcon.query(sql_insert, function (err, result) {
      if (err) throw err;
 
      if(result)
      {
       response = {
      
         msg:'Post added seccessfully!',
         status:1
      };
      }
      else{
       response = {
      
         msg:'Problem in doing post!',
         status:0
      };
      }
      res.send(response);  
      console.log("1 record inserted");
   });
   //console.log(response);
 
   // Prepare output in JSON format
  
    
 });

router.post('/create_request', function(req, res) {
 var fname=req.body.fname;
 var femail=req.body.femail;
 var fphone=req.body.fphone;
 var fmsg=req.body.fmessage;
  console.log(req.body);
  var sql_insert = "INSERT INTO requestcallback (fname,femail,fphone,fmsg) VALUES ('"+fname+"', '"+femail+"', '"+fphone+"', '"+fmsg+"')";
  sqlcon.query(sql_insert, function (err, result) {
     if (err) throw err;

     if(result)
     {
      response = {
     
        msg:'Request Callback Sent seccessfully!',
        status:1
     };
     }
     else{
      response = {
     
        msg:'Problem in sending request callback!',
        status:0
     };
     }
     res.send(response);  
     console.log("1 record inserted");
  });
  //console.log(response);

  // Prepare output in JSON format
 
   
});

router.post('/subscribe_email', function(req, res) {
  var subsemail=req.body.subsemail;
 
   console.log(req.body);
   var sql_insert = "INSERT INTO subscription (subsemail) VALUES ('"+subsemail+"')";
   sqlcon.query(sql_insert, function (err, result) {
      if (err) throw err;
 
      if(result)
      {
       response = {
      
         msg:'Subscription done seccessfully!',
         status:1
      };
      }
      else{
       response = {
      
         msg:'Problem in doing subscription!',
         status:0
      };
      }
      res.send(response);  
      console.log("1 record inserted");
   });
   //console.log(response);
 
   // Prepare output in JSON format
  
    
 });

router.get('/cms', (req, res) => {
  res.send('In cms page')
})

module.exports=router;

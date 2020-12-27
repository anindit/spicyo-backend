const router = require('express').Router();
var moment = require('moment');

const authController=require('../../controller/authController');
const bannerController=require('../../controller/bannerController');
const recipeController=require('../../controller/recipeController');
const blogController=require('../../controller/blogController');
const clientController=require('../../controller/clientController');
const reviewController=require('../../controller/reviewController');


const sqlcon = require("../../db.js");

router.get('/home', (req, res) => {
  let user=req.session.user;
  console.log('-------------')
  console.log(req.session)
  console.log(user)
  console.log(req.session.isloggedin)
  if(user)
  {
    res.render('index.hbs',{
      title:'Home',
      userdetails:user,
      isloggedin:req.session.isloggedin,
      token:req.session.token
    })
  }
  else{
    res.redirect('/admin/login')
  }
  
})
router.get('/register', (req, res) => {
  let user=req.session.user;
  if(!user)
  {
    res.render('register.hbs',{
      layout: 'other',
      title:'Register'
    })
  }
  else{
    res.redirect('/admin/login')
  }
  
})

router.get('/login', (req, res) => {
  let user=req.session.user;
  if(!user)
  {
    res.render('login.hbs',{
      layout: 'other',
      title:'Login'
    })
  }
  else{
    res.redirect('/admin/home')
  }
  
})



router.get('/addbanner', (req, res) => {
  let user=req.session.user;
  if(user)
  {
    res.render('addbanner.hbs',{
      btitle:'Add Banner',
    })
  }
  else{
    res.redirect('/admin/login')
  }
  
})

router.get('/logout',function(req,res){    
  req.session.destroy(function(err){  
      if(err){  
          console.log(err);  
      }  
      else  
      {  
          res.redirect('/admin/login');  
      }  
  });  

}); 

router.get('/requestCallBack',function(req,res){    
  let user=req.session.user;
  if(user)
  {
    var sql_banner_select = "select * from requestcallback where 1";
    // console.log(sql_username_select)
        sqlcon.query(sql_banner_select, function (err, result) {
   //console.log(result)
         if(err) throw err;
         return res.render('requestcallback',{
           message:'Updated data',
           allrequest:result,
           moment: moment
         }); 
        })
    
  }
  else{
    res.redirect('/admin/login')
  } 

}); 

router.get('/subscription',function(req,res){    
  let user=req.session.user;
  if(user)
  {
    var sql_banner_select = "select * from subscription where 1";
    // console.log(sql_username_select)
        sqlcon.query(sql_banner_select, function (err, result) {
   //console.log(result)
         if(err) throw err;
         return res.render('subscription',{
           message:'Updated data',
           allrequest:result,
           moment: moment
         }); 
        })
    
  }
  else{
    res.redirect('/admin/login')
  } 

}); 



router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/myprofile", authController.myprofileget);
router.post("/myprofile", authController.myprofile);

router.post("/addbanner", bannerController.addbanner);
router.get("/banner", bannerController.allBanner);
router.get("/editbanner/:id", bannerController.editbanner);
router.get("/deletebanner/:id", bannerController.deletebanner);

router.get("/recipe", recipeController.allRecipe);
router.get("/addrecipe", recipeController.addrecipeget);
router.post("/addrecipe", recipeController.addrecipe);
router.get("/editrecipe/:id", recipeController.editrecipe);
router.get("/deleterecipe/:id", recipeController.deleterecipe);

router.get("/blog", blogController.allBlog);
router.get("/addblog", blogController.addblogget);
router.post("/addblog", blogController.addblog);
router.get("/editblog/:id", blogController.editblog);
router.get("/deleteblog/:id", blogController.deleteblog);

router.get("/client", clientController.allClient);
router.get("/addclient", clientController.addclientget);
router.post("/addclient", clientController.addclient);
router.get("/editclient/:id", clientController.editclient);
router.get("/deleteclient/:id", clientController.deleteclient);

router.get("/review/:clientid", reviewController.allreview);
router.post("/addreview", reviewController.addreview);
router.get("/editreview/:id", reviewController.editreview);
router.get("/deletereview/:id/:userid", reviewController.deletereview);
router.get("/approvereview/:id/:userid/:status", reviewController.approvereview);

module.exports=router;

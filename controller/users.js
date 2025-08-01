
const User = require("../models/user");



module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs"); 
};


module.exports.signup = async(req,res)=>{
    try{
        let {username, email, password} = req.body;
    const newUser = new User({email, username});
    let registeredUser = await User.register(newUser , password);    
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
         if(err){
          return  next(err);
        }
        req.flash("success", "Welcome to Wonderlust");
        res.redirect("/listings");
    }) 
    // req.flash("success", "Welcome to Wonderlust");
    // res.redirect("/listings");
    }catch(e){
        req.flash("error" , e.message);
        res.redirect("/signup");
    }
   
};


module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
      req.flash("success","Welcome back to Wonderlust!");
      let redirectUrl = res.locals.redirectUrl || "/listings";         //redirect user on the page from where they get login options
      res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success", "you are logged out now!");
        res.redirect("/listings");
    })
};
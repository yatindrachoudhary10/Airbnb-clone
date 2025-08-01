if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
} 



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override"); //for put request
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User =require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const helmet = require("helmet");
app.use(helmet());





app.set("view engine", "ejs");
app.set("views" , path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));  // for parsing data
app.use(methodOverride("_method"));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); // using static files





const dbUrl = process.env.ATLASDB_URL;


main().then(()=>{
    console.log("connection successful");
})
.catch((err) => { 
    console.log(err);
});



async function main() {
  await mongoose.connect(dbUrl);
}


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error", ()=>{
    console.log("ERROR IN MONGO SESSION STORE", err);
})

//defining sessions
const sessionOptions = {
    store,                            //session data will be saved on atlas
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}



app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' https://res.cloudinary.com data:;"
  );
  next();
});


// app.get("/" , (req,res) =>{
//     res.send("hi i am root");
// });


app.get("/", (req, res) => {
  res.redirect("/listings");
});

























//using session
app.use(session(sessionOptions));






//using flash
app.use(flash());   //1.







//initializing passport as middleware for every request
app.use(passport.initialize());  //1.
app.use(passport.session());    //2. sessions used by passport
passport.use(new LocalStrategy(User.authenticate())); //use static authenticate method of model in  LocalStrategy
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());   //serializeUser() Generates a function that is used by Passport to serialize users into the session
passport.deserializeUser(User.deserializeUser());  //deserializeUser() Generates a function that is used by Passport to deserialize users into the session







//defining middleware for flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");    // 2. saving it in locals
     res.locals.error = req.flash("error");  
     res.locals.currUser =req.user;            //it saves information of current user
    next();                      
})





//Demo User route
// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     })

//    let registeredUser = await User.register(fakeUser,"helloworld");  //static method which automatically save data with password helloworld
//    res.send(registeredUser);
// })







//listing router
app.use("/listings" ,listingRouter);



//review router
app.use("/listings/:id/reviews", reviewRouter);





//user router
app.use("/", userRouter);





















//testing model
// app.get("/testListing", async (req,res)=>{
//      let sampleListing = new Listing({
//         title : "My new Villa",
//         description: "By the beach",
//         price:1200 ,
//         location : "Calanagat , Goa",
//         country: "India", 
//      });

//      await sampleListing.save();
//      console.log("sample was saved");
//       res.send("successful testing");
// });





//when enter the wrong route he will get the custom error page not found
// app.all("*", (req,res,next)=>{
//     next(new ExpressError(404, "Page Not Found!"));
// });










//Error handling middleware
 app.use((err,req,res,next)=>{
    let {statusCode =500 ,message="Something went wrong!"} = err; //extracting status and message from err
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
 })   







 
app.listen(8080, ()=> {
    console.log("sever is listening to port 8080");
});



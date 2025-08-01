const { model } = require("mongoose");
const Listing = require("../models/listing.js");



//writing callbacks
//index route 
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
};

//new route
module.exports.renderNewForm = async (req,res)=>{
    res.render("listings/new");
};


//Show route
module.exports.showListings =  async (req,res)=>{
    let {id} =req.params;
     const listing =await Listing.findById(id)
     .populate({path:"reviews",
        populate:{
            path: "author",
        }
     })
     .populate("owner"); //whenever we have list of object ids and we want their data we use populate to extract it
     if(!listing){
         req.flash("error" ,"Listing you requested for does not exist!");
         res.redirect("/listings");
     }
     res.render("listings/show", {listing});

};


//create route
module.exports.createListing = async (req,res,next)=>{
    let url = req.file.path;   
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;   //gets user id
    newListing.image = {url ,filename};
    await newListing.save();
   req.flash("success" ,"New Listing Created!");       //3. defining message to be flash
   res.redirect("/listings");
   
};


//Edit route
module.exports.renderEditForm = async (req,res)=> {
    let {id} =req.params;
     const listing =await Listing.findById(id);
      if(!listing){
         req.flash("error" ,"Listing you requested for does not exist!");
         res.redirect("/listings");
     }
     let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload", "/upload/,w_250");
     res.render("listings/edit", {listing, originalImageUrl});
};

//Update route
module.exports.updateListing = async (req,res)=>{
     let {id} =req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); //(...) is used to deconstruct parameters from javascript object
    
    if(typeof req.file !=="undefined"){
    let url = req.file.path;   
    let filename = req.file.filename;
    listing.image = {url ,filename};
    await listing.save();
    }
   
      req.flash("success" ,"Listing Updated!");
     res.redirect(`/listings/${id}`);
};


//Delete route
module.exports.destroyLsitng = async (req,res)=>{
    let {id} =req.params;
    let deletedListings = await Listing.findByIdAndDelete(id);
    console.log(deletedListings);
     req.flash("success" ,"Listing Deleted!");
    res.redirect("/listings"); 
}


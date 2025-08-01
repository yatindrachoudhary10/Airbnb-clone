 const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
 
 //post route
 module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);  //finding id
    let newReview = new Review(req.body.review);         //extracting review by name
    newReview.author = req.user._id;     // attaching new field called author with newReview
    listing.reviews.push(newReview);      //first we are putting form review in listing 
    await newReview.save();            // we are saving review
    await listing.save();             // we are saving listing
     req.flash("success" ,"New Review Created!");
   res.redirect(`/listings/${listing._id}`);
}

//Review delete route
module.exports.destroyReview =async (req,res)=>{
    let {id ,reviewId} = req.params;
    await  Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}}); 
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" ,"Review Deleted!");
   res.redirect(`/listings/${id}`)
}
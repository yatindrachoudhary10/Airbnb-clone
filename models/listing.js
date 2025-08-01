const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;


// defining a schema
const listingSchema = new Schema({
    title: {
        type:String,
       required:true ,
    }
    ,
    description:String,
    image: {
       url: String,
       filename: String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
        type: Schema.Types.ObjectId,   //one to many relationship
        ref: "Review"                //from which relationship has build
        }
    ],
    owner:{
         type: Schema.Types.ObjectId,   //one to many relationship
        ref: "User" 
    }
}); 


listingSchema.post("findOneAndDelete" , async (listing) => {
    if(listing){
 await Review.deleteMany({_id :{$in: listing.reviews}});
    }
      
})


// compile our model
const Listing = mongoose.model("Listing" ,listingSchema);
module.exports = Listing;
const express = require("express");
const app = express();
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn ,isOwner, validateListing} = require("../middleware.js");
const listingcontroller = require("../controller/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })  //multer where to store files

//New route
router.get("/new",isLoggedIn,wrapAsync( listingcontroller.renderNewForm));

//index route
//create route
router.route("/")
 .get( wrapAsync(listingcontroller.index ))
  .post(isLoggedIn ,validateListing,upload.single('listing[image]'), wrapAsync(listingcontroller.createListing));//pload.single('listing[image]') -- multer process the image data in listing



//Edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingcontroller.renderEditForm));


//Show route
//update route
//Delete route
router.route("/:id")
.get( wrapAsync(listingcontroller.showListings))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing, wrapAsync(listingcontroller.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingcontroller.destroyLsitng));







module.exports = router;
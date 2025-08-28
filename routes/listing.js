const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { authorize } = require("passport");
const listingControllers = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


router
.route("/")
.get( wrapAsync(listingControllers.index))
.post( 
isLoggedIn, 
validateListing, 
upload.single('listing[image]'),
wrapAsync(listingControllers.createListing));


//new route
router.get("/new", isLoggedIn, listingControllers.renderNewForm);

//search
router.post("/search", wrapAsync(listingControllers.searchListing ));

router.route("/:id")
.get(wrapAsync(listingControllers.showListing))
.put(
isLoggedIn, 
isOwner,
upload.single('listing[image]'), validateListing, 
wrapAsync(listingControllers.updateListing))
.delete( 
isLoggedIn, 
isOwner,  
wrapAsync( listingControllers.destroyListing));


//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditForm));





module.exports = router;
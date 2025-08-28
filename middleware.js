const Listing = require("./models/listing");
const {listingSchema} = require("./schema");
const ExpressError = require("./utils/ExpressError");
const {reviewSchema} = require("./schema");
const Review = require("./models/review");

module.exports.isLoggedIn = (req, res, next) => {
//   console.log(req.user);
     if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to access this page.");
       return  res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
   if(req.session.redirectUrl){
      res.locals.redirectUrl = req.session.redirectUrl;
   }
   next();
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let currListing = await Listing.findById(id);
    if(!  currListing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "you don't have permission to that route.");
        return  res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
   // console.log(result);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }

}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

module.exports.isReviewAuthor  = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let currReview = await Review.findById(reviewId);
    if(!  currReview.author.equals(res.locals.currUser._id)){
        req.flash("error", "you don't have permission to that route.");
        return  res.redirect(`/listings/${id}`);
    }
    next();
}
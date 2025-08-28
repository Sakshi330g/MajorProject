const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    description: {
        type:String,
    },
   image: {
    type: {
        filename: String,
        url: String,
    },
    _id:false,
    default: () => ({
        filename: "listingimage",
        url: "https://images.unsplash.com/photo-1585541115293-82dcce3d1a1b?fm=jpg&q=60&w=3000"
    }),
    set: (v) => {
        if (!v || !v.url) {
            return {
                filename: "listingimage",
                url: "https://images.unsplash.com/photo-1585541115293-82dcce3d1a1b?fm=jpg&q=60&w=3000"
            };
        }
        return v;
    }
}
,
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing){
    await Review.deleteMany({_id: {$in : listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);


module.exports = Listing;
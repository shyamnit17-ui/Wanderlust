const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review")
const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    image: {
        filename: {
            type: String,
            default: "listingimage",
        },
        url: {
            type: String,
            default: "https://unsplash.com/photos/modern-building-facade-with-curved-windows-and-horizontal-lines-gJdQ3FV3-Mw",
        },
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    },

    location: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true,
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }]
});
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
     await Review.deleteMany({_id:{$in:listing.reviews}});
  }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

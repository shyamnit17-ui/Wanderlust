const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

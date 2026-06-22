const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./schema.js");

app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, 'public')));
main().then(() => {
    console.log("connection succesful to db");
}).catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send("hi i am root");
});
app.engine("ejs", ejsmate);
// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "my new villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Goa",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("succesful testing");
// });


app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });

}));
// new route
app.get("/listings/new", ((req, res) => {
    res.render("listings/new.ejs");
}));
//show route
app.get("/listings/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
}));

//create route
app.post("/listings", wrapAsync(async (req, res, next) => {
   let result= listingSchema.validate(req.body);
    console.log(result);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}));
//update route
app.put("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);

}));
//delete route 
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");

}));
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "page not found"));
});
//error handling middleware
app.use((err, req, res, next) => {
    let {statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{err});
});
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
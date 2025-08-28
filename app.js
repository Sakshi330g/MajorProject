if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const ExpressError = require("./utils/ExpressError.js");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


app.set("view engine", "ejs");
app.use(express.urlencoded( {extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");



//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

async function main() {
  await mongoose.connect(dbUrl);
}

main().then(()=>{
console.log(" Connected to MongoDB");
}).catch((err) => {
console.log(err);
})




app.listen(8080, () => {
      console.log(" Server running on localhost");
    });

// app.get("/", (req, res)=> {
//     res.send("Hello! Happy to share response");
// });

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
});

store.on("error", (err) => {
  console.log("Error in the mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized :true,
  cookie: {
    expires: Date.now()  + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true,

  },
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  console.log(res.locals.success);
  next();
})

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });
//   let registeredUser = await User.register(fakeUser, "helloWorld");
//   res.send(registeredUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);










// app.get("/testListing", async(req, res) => {
//  let sampleListing = new Listing({
//     title:"My New Villa",
//     description:"By the beach",
//     price:1200,
//     location: "calangute, goa",
//     country:"India", 
//  });
//  await sampleListing.save();
//  console.log("Sample was saved");
//  res.send("Successful testing");
// });
//  app.all("*", (req, res, next) => {
//      next(new ExpressError(404, "Page not found!!"));
//  });






app.all("/*splat", (req, res, next) => {
     next(new ExpressError(404, "Page not found!!"));
});




app.use((err, req, res,next) => {
    let {statusCode = 500, message ="something went wrong "} = err;
    res.status(statusCode).render("error.ejs", {message});
    //res.status(statusCode).send(message);
});

// app.listen(8080, () => {
//     console.log("listening on port number 8080");
// });

const express    = require("express"),
      app        = express(),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose"),
      flash      = require("connect-flash"),
      passport   = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      Campground = require("./models/campground"),
      seedDB     = require("./seeds"),
      User       = require("./models/user"),
      Comment    = require("./models/comment");

const commentRoutes     = require("./routes/comments"),
      campgroundRoutes  = require("./routes/campgrounds"),
      indexRoutes       = require("./routes/index");

mongoose.connect(process.env.DATABASEURL,
{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

// mongoose.connect("mongodb+srv://firstuser:somepassword@cluster0.2oph2.mongodb.net/yelp_camp?retryWrites=true&w=majority",
// {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify:false});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
// seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Harry Potter makes me nostalgic!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, function(){
    console.log("The YELPCAMP Server has started!!!");
});
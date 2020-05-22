var express     = require("express"),
     app        = express(),
     bodyParser = require("body-parser"),
     mongoose   = require("mongoose"),
	 flash      = require("connect-flash"),
     passport   = require("passport"),
  LocalStrategy = require("passport-local"),
methodOverride  = require("method-override"),
     Campground = require("./models/campgrounds"),
     Comment    = require("./models/comment"),
      User      = require("./models/user"),
	 seedDB     = require("./seeds");
var passportLocalMongoose = require("passport-local-mongoose");

var commentRoutes = require("./routes/comments");
var campgroundRoutes = require("./routes/campgrounds");
var authRoutes = require("./routes/index");

//seedDB(); //seed the database

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb+srv://Avvu:akitnava@cluster0-vg86b.mongodb.net/test?retryWrites=true&w=majority', {
useUnifiedTopology: true,
useNewUrlParser: true,
}).then(() => {
	console.log('Connected to DB');
}).catch(err => {
	console.log('ERROR:' , err.message);
});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname +"/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
   secret :"i am good",
   resave :false,
   saveUninitialized :false
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
app.use("/",authRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds",campgroundRoutes);


app.listen(3000, function(){
	console.log("YelpCamp has started");
});
	
	
	
	
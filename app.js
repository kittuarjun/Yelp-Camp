const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const dotenv = require("dotenv");
dotenv.config();


console.log("MAP:", process.env.MAPTILER_API_KEY);
console.log(process.env.MAPTILER_API_KEY);
const sanitizeV5 = require('./utils/mongoSanitizeV5.js');
const express=require("express")
const app=express();
app.set('query parser', 'extended');
const path=require("path")
const mongoose=require("mongoose");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const Joi=require("joi");
const  {campgroundSchema,reviewSchema}=require("./schemas.js")
const catchAsync=require("./utils/catchAsync");
const ExpressError=require("./utils/ExpressError")
const methodOverride=require("method-override");
const Campground=require("./models/campground")
const Review=require("./models/review")
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const campgroundRoutes=require("./routes/campgrounds")
const User=require("./models/user");



const userRoutes=require("./routes/users")
const   reviewRoutes=require("./routes/reviews")

 
const { MongoStore } = require('connect-mongo');
const dbUrl=process.env.DB_URL;
console.log("DB_URL exists:", !!process.env.DB_URL);
mongoose.set('strictQuery',true);
mongoose.connect(dbUrl)
//"mongodb://localhost:27017/yelp-camp-maptiler"

const db=mongoose.connection;
db.on("error",console.error.bind(console,"Connection Error: "));
db.once("open",()=>{
    console.log("Database Connected");
})

app.engine("ejs",ejsMate)
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(sanitizeV5({ replaceWith: '_' }));

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});

store.on("error",function(e){
    console.log("Session Store error",e)
})
const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig)); 
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log("MAP TOKEN:", process.env.MAPTILER_API_KEY);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.mapToken = process.env.MAPTILER_API_KEY;
    next();
})


app.use("/",userRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/reviews",reviewRoutes);

app.get("/",(req,res)=>{
    res.render("home.ejs");
})

// app.all("/{*path}",(req,res,next)=>{
//     next (new ExpressError("Page Not Found",400))
// })



app.all("/{*splat}",(req,res,next)=>{
    next(new ExpressError("Page Not Found",404))
})

app.use((err,req,res,next)=>{
    const {statusCode=500,message="Something Went Wrong"}=err;
    if(!err.message) err.message="Oh No, Something WentWrong"
    res.status(statusCode).render("error",{err});
    // res.send("Oh boy, something went wrong");
})
app.listen(3000,()=>{
    console.log("Serving On port 3000");
})


//POST /campfound/:id/reveiws
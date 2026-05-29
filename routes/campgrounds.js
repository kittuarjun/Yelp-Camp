const express=require("express");
const router=express.Router();
const campgrounds=require("../controllers/campgrounds")
const catchAsync=require("../utils/catchAsync");
const ExpressError=require("../utils/ExpressError")
const Campground=require("../models/campground")
const  {campgroundSchema}=require("../schemas.js")
const {isLoggedIn,isAuthor,validateCampground}=require("../middleware");
const multer=require("multer");
const {storage}=require("../cloudinary");
const upload=multer({storage});

router.route("/")
    .get(catchAsync(campgrounds.index))
     .post(isLoggedIn,upload.array("image"),validateCampground,catchAsync(campgrounds.createCampground))
    // .post(upload.array("image"), (req, res) => {
    // console.log(req.body,req.files);
    // res.send("done");
        // })
 router.get("/new",isLoggedIn,campgrounds.renderNewForm)


  router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))
  
router.route("/:id")
      .get(catchAsync(campgrounds.showCampground))
    //   .put(isLoggedIn,isAuthor,upload.array("image"),validateCampground,catchAsync(campgrounds.updateCampground))
    .put(isLoggedIn, isAuthor, (req, res, next) => {
    upload.array("image")(req, res, function (err) {
        if (err) {
            console.log("UPLOAD ERROR:", err);
            return next(err);
        }
        next();
    });
}, validateCampground, catchAsync(campgrounds.updateCampground))
      .delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

 //     // router.get("/",catchAsync(campgrounds.index));

// // router.post("/",isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground))
// router.get("/:id",catchAsync(campgrounds.showCampground))



// router.put("/:id",isLoggedIn,isAuthor,validateCampground,catchAsync(campgrounds.updateCampground))

// router.delete("/:id",isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))

module.exports=router;
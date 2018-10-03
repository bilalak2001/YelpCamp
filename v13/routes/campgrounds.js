var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var Comment = require("../models/comment");
var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'bilalb', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get("/", function(req, res){
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            Campground.count({name: regex}).exec(function (err, count) {
                if (err) {
                    console.log(err);
                    res.redirect("back");
                } else {
                    if(allCampgrounds.length < 1) {
                        noMatch = "No campgrounds match that query, please try again.";
                    }
                    res.render("campgrounds/index", {
                    campgrounds: allCampgrounds, 
                    currentUser: req.user, 
                    current: pageNumber,
                    pages: Math.ceil(count / perPage),
                    page: 'campgrounds',
                    noMatch: noMatch,
                    search: req.query.search
                    });
                }
            });
        });
    } else{
        // Get all campground from DB
        Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec(function (err, allCampgrounds) {
            Campground.count().exec(function (err, count) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("campgrounds/index", {
                        campgrounds: allCampgrounds,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        noMatch: noMatch,
                        search: false
                    });
                }
            });
        });
    }
});

router.post("/", middleware.isLoggedIn, upload.single('image'), function(req, res) {
 cloudinary.uploader.upload(req.file.path, function(result){ 
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var price= req.body.price;
    var image=result.secure_url;
    var desc=req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground={name:name, price: price, image: image, description: desc, author:author};
    
    //Create a new campground and save to DB
    Campground.create(newCampground,function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
            
    })
    
  });
});

//NEW ROUTE
router.get("/new",middleware.isLoggedIn, function(req, res) {
   res.render("campgrounds/new");
});


// SHOW- shows more info about one campground
router.get("/:id", function(req, res) {
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").populate({
        path: "reviews",
        options: {sort: {createdAt: -1}}
    }).exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            console.log(foundCampground);
           //render show template with that campground
            res.render("campgrounds/show",{campground: foundCampground}); 
        }
    });
});



//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function(err, updatedCamgpround){
        if(err){
            res.redirect("/campgrounds");
        } else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, campground){
        if(err){
            res.redirect("/campgrounds");
        } else{
            //deletes all comments associated with the campground
            Comment.remove({"_id": {$in: campground.comments}}, function(err){
                if (err) {
                    console.log(err);
                    return res.redirect("/campgrounds");
                }
                //deletes all reviews associated with the campground
                Review.remove({"_id": {$in: campground.reviews}}, function(err){
                    if(err){
                        console.log(err);
                        return res.redirect("/campgrounds");
                    }
                //delete the campground
                campground.remove();
                req.flash("success", "Campground deleted successfully!");
                res.redirect("campgrounds");
                })
            })
            res.redirect("/campgrounds");
        }
    });
});
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
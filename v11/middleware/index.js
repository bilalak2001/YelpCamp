var Campground = require("../models/campground");
var Comment    = require("../models/comment");

//all the middleware goes in here


var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  if(req.isAuthenticated()){
            Campground.findById(req.params.id, function(err, foundCampground){
            //does user own the campground
                 if(foundCampground.author.id.equals(req.user._id) || currentUser && currentUser.isAdmin){
                            next();
                 } else {
                            req.flash("error", "Permission denied!");
                            res.redirect("/campgrounds/" + req.params.id);
                        }
            });            
        } else {
            req.flash("error", "You need to be signed in to do that!");
            res.redirect("/login");
        }  
}



middlewareObj.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
            Comment.findById(req.params.comment_id, function(err, foundComment){
              //does user own the comment?
                    if(foundComment.author.id.equals(req.user._id) || currentUser && currentUser.isAdmin){
                        next();
                    } else {
                         req.flash("error", "Permission Denied!")
                         res.redirect("/campgrounds/" + req.params.id);             
                         }
                
            });            
        } else{
            req.flash("error", "You need to be logged in to do that");
            res.redirect("login");
        }  
}

middlewareObj.isLoggedIn= function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!")
    res.redirect("/login")
}


module.exports = middlewareObj
var Campground = require("../models/campgrounds");
var Comment    = require("../models/comment");
//all middlewares
var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req ,res ,next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			
			res.redirect("back");
		} else {
			
			//does he own th cg
			if(foundCampground.author.id.equals(req.user._id)){
				next();
			   }
	        else{
				req.flash("error", "You don't have permission to do that");
			res.redirect("back");
			   }
		}
	    });
	}
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
  }


middlewareObj.checkCommentOwnership = function(req ,res ,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
			
			//does he own th cg
			if(foundComment.author.id.equals(req.user._id)){
				next();
			   }
	        else{
				req.flash("error", "You don't have permission to do that");
			res.redirect("back");
			   }
		}
	    });
	}
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
  }


middlewareObj.isLoggedIn = function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	 req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
    }

module.exports = middlewareObj;
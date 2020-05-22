var express = require("express");
var router  = express.Router({mergeParams: true}); 
var Campground = require("../models/campgrounds"),
     Comment    = require("../models/comment");
var middleware = require("../middleware");


//COMMENTS ROUTE

router.get("/new",middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new", {campground : campground});
		}
	   });
    });

router.post("/",middleware.isLoggedIn, function(req, res){
//lookup cg using id
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			console.log(err);
		    res.redirect("/campgrounds");
		}
		else{
			//create new comment
		Comment.create(req.body.comment, function(err,comment){
			if(err){
				console.log(err);
			}
			else{
				//add and save username and id to comment permanent
				comment.author.id = req.user._id;
				comment.author.username = req.user.username;
				comment.save();
				//connect neww cmnt to cg
				campground.comments.push(comment);
				campground.save();
				//redirect to show page
				res.redirect("/campgrounds/"+campground._id);
			}
		});
		}
	   });
	});

//EDIT ROUTE
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id, function(err,  comment){
		if(err){
		console.log(err);
		}
		else{
			res.render("comments/edit", {campground_id: req.params.id ,comment: comment});
		}
		
		  });
		});

//UPDATE ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
		//find and update cg
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
	 if(err){
		 console.log(err);
		 res.redirect("/campgrounds");
	 }
	 else{
		 res.redirect("/campgrounds/"+ req.params.id);
	 }
 });
	
});

//DELETE ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership ,function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			res.redirect("/campgrounds");
		}
		else{
			res.redirect("/campgrounds" + req.params.id);
		}
	});
});



module.exports = router;
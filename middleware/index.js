let Blog = require('../model/blogs');
let Comment = require('../model/comments');
let User    = require('../model/user')


//all the middleware goes here
var   middlewareObj = {};

//config

middlewareObj.checkBlogOwnership = (req,res,next) =>{
    if(req.isAuthenticated()){
        Blog.findById(req.params.id, (err,foundBlog) => {
            if(err) {
                req.flash("error", "Campground not found");
                res.redirect('back');
            } else {
                if(foundBlog.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect('back');
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect('/login');
    }
};

middlewareObj.checkCommentOwnership = (req,res,next) => {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id , (err,foundComment) => {
            if(err) {
                 res.redirect('back');
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = (req,res,next) => {
    if(req.isAuthenticated()) {
        return next();
}   
    req.flash("error", "You need to be logged in to do that");
    res.redirect('/login')
};

middlewareObj.checkprofileOwnership = (req,res,next) => {
        if(req.isAuthenticated()){
            User.findById(req.params.id, (err,foundUser) => {
                
                if(err) {
                    req.flash("error", "profile not found");
                    res.redirect('/')
                } else {
                   if(foundUser.equals(req.user._id)) {
                         next();
                   }  else {
                    req.flash('error',"You don't have permission to do that");
                    console.log('BAD!!!');
                    res.redirect('/');
                  }       
                }        
            });
        } else {
            req.flash('error',"You need to be signed in to do that!!");
            res.redirect('/');
        }
}

module.exports = middlewareObj;




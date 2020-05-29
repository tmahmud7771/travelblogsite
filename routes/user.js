let express    = require("express");
    router     = express.Router();
    passport   = require("passport");
    User       = require("../model/user");
    Blogs      = require('../model/blogs');
    middleware = require('../middleware/index');
//register form 


router.post('/register',(req,res) => {
    let newUser = new User({username : req.body.username});
    User.register(newUser, req.body.password , (err, user ) => {
        if(err) {
            req.flash("error", err.message);
            return res.render('login');
        } else {
            passport.authenticate('local')(req,res, () => {
                req.flash("success", "Welcome to our Blogsite " + user.username);
                res.redirect('/blogs')
            });
        }
    });

});

//sing form 
router.get('/login',(req,res) => {
    res.render('login')
});

router.post('/login',passport.authenticate( 'local',
{   
    successRedirect: "/blogs",
    failureRedirect: "/login"
}) , (req,res) => {
});

//logout 
router.get('/logout',(req,res) => {
        req.logout();
        req.flash("success", "Logged you out!");
        res.redirect('/');
});

//profile page (middleware.checkprofileOwnership)

router.get('/users/:id',middleware.isLoggedIn,(req,res) => {
    User.findById(req.params.id, (err,foundUser) => {
        if(err) {
            req.flash('error',"Something went wrong");
            return res.redirect('/');
        }
        Blogs.find().where('author.id').equals(foundUser._id).exec((err, blogs) => {
            if(err) {
                req.flash('error','Something went Wrong');
                return res.redirect('/');
            } else {
                res.render('profile',{user:foundUser, blogs:blogs})
            }
        })
    })
});

router.get('/users',middleware.isLoggedIn,(req,res) => {
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        User.find({username:regex},(err,foundUser) => {
            if(err) {
                console.log(err);
            } else {
                if(foundUser.length < 1) {
                    noMatch = 'No User found'
                } 
                   res.render('users',{users:foundUser, noMatch:noMatch});
        }
        });
    } else {
    User.find({},(err,foundUser) => {
        if(err){
            console.log(err);
            req.flash('error','Something Went Wrong')
        } else {
            res.render('users',{users:foundUser})
        }
    })
}
});

router.get('/users/:id/edit',middleware.checkprofileOwnership,(req,res) => {
    User.findById(req.params.id,(err,editUser) => {
        if(err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.render('useredit',{user: editUser});
        }
    })
});

//update method 
router.put('/users/:id',middleware.checkprofileOwnership,(req,res) => {
    User.findByIdAndUpdate(req.params.id,req.body.user,(err, updatedUser) => {
        if(err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/users/'+ req.params.id )
        }
    })
});


//regex 
function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;

let express    = require('express')
let Comment    = require('../model/comments')
let Blogs      = require('../model/blogs')
let router     = express.Router();
let middleware = require('../middleware/index');


//routes
router.get('/',(req,res) => {
    Blogs.find({},(err,allBlogs) => {
        if(err) {
            console.log(err);
        } else {
            res.render('landing', {blogs :allBlogs});
        }
    })

});
//blogs routing 
//show-all-blog-page
router.get('/blogs',(req,res) => {
    var noMatch = null;
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        //get all blogs
        Blogs.find({title: regex},(err,allblogs) => {
            if(err) {
                console.log(err);
            } else {
                if(allblogs.length < 1) {
                    noMatch = 'No blogs match that query.please try again';
                }
                res.render('blogs/blogShow',{blogs: allblogs, noMatch:noMatch})
            }
        });
        } else {
    Blogs.find({},(err,allBlogs) => {
        if(err) {
            console.log(err);
            req.flash('error','Something Went Wrong')
        } else {
            res.render('blogs/blogShow', {blogs: allBlogs});
        }
    })
}
});

router.post('/blogs',middleware.isLoggedIn,(req,res) => {
   
    req.body.blog.author = {
        id: req.user._id,
        username: req.user.username
    }
    
    Blogs.create(req.body.blog,(err,newlyCreated) => {
        if(err){
            console.log('err')
        } else {
            res.redirect('/blogs')
        }
    });
});


//blog adding form 
router.get('/blogs/new',middleware.isLoggedIn,(req,res) => {
    res.render('blogs/new.ejs')
});
//blog show page 
router.get('/blogs/:id',(req,res) => {
    Blogs.findById(req.params.id).populate("comments").exec((err,foundBlogs) => {
        if(err){
            console.log('error');
        } else {
            res.render('blogs/show',{blog: foundBlogs})
        }
    })
});

//edit page 
router.get('/blogs/:id/edit',middleware.checkBlogOwnership,(req,res) => {
    Blogs.findById(req.params.id, (err,editedBlog) => {
        if(err) {
            console.log(err);
            res.redirect('back')
        } else {
            res.render('blogs/edit',{blog : editedBlog});
        }
    })
});
//edit post request 
router.put('/blogs/:id',middleware.checkBlogOwnership,(req,res) => {
Blogs.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog) => {
    if(err){
        console.log(err);
        res.redirect('back');
    } else {
        res.redirect("/blogs/" + req.params.id)
    }
})
});

//delete 
router.delete('/blogs/:id',middleware.checkBlogOwnership, (req,res) => {
    Blogs.findByIdAndDelete(req.params.id, (err, deleteBlog) => {
        if(err) {
            res.redirect('back');
        } else {
            res.redirect('/blogs');
        }
    })
})

function escapeRegex(text){
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
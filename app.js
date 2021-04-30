let express        = require("express");
    bodyParser     = require("body-parser");
    mongoose       = require('mongoose')
    Blogs          = require('./model/blogs')
    flash          = require("connect-flash"),
    Comment        = require('./model/comments')
    methodOverride = require("method-override"),
    app            = express();
    passport       = require("passport"),
    LocalStrategy  = require("passport-local"),
    User           = require("./model/user"),

//mongoose setup 
mongoose.connect('mongodb+srv://tausif:Travel@cluster0-ytdq7.gcp.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser:true,useCreateIndex:true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());
//config 

app.use(require("express-session")({
    secret: "I love my car very much!!!",
    resave: false,
    saveUninitialized: false
}));

//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//passport intialize 
app.use((req,res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

let blogsRoutes = require('./routes/blogs');
let commentRoutes = require('./routes/comments')
let userRoutes = require('./routes/user');


app.use(userRoutes);
app.use(blogsRoutes);
app.use(commentRoutes);
app.get('/profile',(req,res) => {
    res.render('profile')
})
//server
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
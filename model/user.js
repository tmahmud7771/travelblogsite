var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    bio: {type:String , default:'...'},
    image: {type:String , default:'https://pngimage.net/wp-content/uploads/2018/06/logo-profil-png-1.png'} ,
    background: {type:String , default:'https://i.pinimg.com/originals/7c/cb/01/7ccb010d8fddc4bcd84587ef3c34d100.jpg' }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
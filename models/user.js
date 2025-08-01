const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
//passportLocalMongoose it self define password and username for us ,we don't have to define it in our schema

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
    }
})

userSchema.plugin(passportLocalMongoose);   //plugin is used because it automatically implement hashing,salting,username and hashpassword

module.exports = mongoose.model("User" , userSchema); 
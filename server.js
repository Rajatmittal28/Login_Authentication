const dotenv = require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const id = process.env.ID;
const pass = process.env.PASS;
const name = process.env.NAME;
const port = process.env.PORT;

const mongo_url = `mongodb+srv://${id}:${pass}@cluster0.9vk4s.mongodb.net/${name}?retryWrites=true&w=majority`;

//connect cloud mongodb database to our server
mongoose.connect(mongo_url , { useUnifiedTopology: true, useNewUrlParser: true })
    .then(result => app.listen(`${port}`,() => console.log("server is Live Now")))
    .catch(err => console.log(err));


// bulid express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


// bulid schema of database
const UserSchema = new mongoose.Schema({
    email:String,
    password:String
});
  
//model of databse
const User = mongoose.model("User",UserSchema);


app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});

app.get("/signup.html",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.get("/login.html",function(req,res){
    res.sendFile(__dirname+"/login.html");
});



app.post("/signup.html",function(req,res){
    var newUserData = new User(req.body);
    // console.log(newUserData);
    newUserData.save()
    .then(item => {
        res.send("<h2>SignUp Done <br>For Login Click On This Given Link <a href='login.html'>Login now</a></h2>");
    })
    .catch(err => {
        res.status(400).send("unable to register");
    })
});


app.post("/login.html",function(req,res){
    const Email = req.body.email;
    const Password = req.body.password;
    User.findOne({email:Email},(err,user) => {
        if(user){
            // console.log(user);
            if(Password == user.password){
                res.send("<h2>Login Successful<br> <a href='/'>HomePage</a></h2>");
            }
            else{
                res.send("<h2>Invalid credentials<br> <a href='login.html'> Try Again</a></h2>");
            }
        }
        else {
            res.send("<h2>First Do Signup Then Login<br> <a href='signup.html'> SignUp</a></h2>");
        }
    })
});



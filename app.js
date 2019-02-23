var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride=require("method-override"),
    expressSanitizer= require("express-sanitizer"),
    app = express();
    
// config mongoose
mongoose.connect("mongodb://localhost:27017/blogapp",{ useNewUrlParser: true });
 // Set view engine to ejs
app.set("view engine","ejs");
// App config
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
    
// Define the mongo db schema
var blogSchema = new mongoose.Schema({
    title : String,
    image : String,
    body : String,
    created : {type: Date, default: Date.now}
});
var Blog = mongoose.model("Blog",blogSchema);


// Blog.create({
//     title : "first",   //testing if Db works
//     image : "https://www.w3schools.com/w3images/fjords.jpg",
//     body : "something"
// });


// RestFul Routes
app.get("/",function(req, res) {
    console.log("reached index .... ");
    res.redirect("/blogs");
    
});
//INDEX ROUTE
app.get("/blogs",function(req,res){
        Blog.find({},function(err,blogs){
            if(err){
                console.log(err);
            } else{
                res.render("index",{blogs:blogs});
            }
        });  
});

// NEW ROUTE
app.get("/blogs/new",function(req, res) {
    res.render("new");
});

app.post("/blogs",function(req,res){
    // Create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog,function(err,newBlog){
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
           res.redirect("/blogs");
        }else{
            // console.log(foundBlog);
            res.render("show",{blog:foundBlog});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit",function(req, res) {
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
           res.redirect("/blogs");
        }else{
            // console.log(foundBlog);
            res.render("edit",{blog:foundBlog});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
        if(err) {
            res.redirect('/blogs');
            
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});


// APP DELETE
app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    });
});

app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Server started");
})
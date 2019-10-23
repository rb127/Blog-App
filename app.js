const bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      expressSanitizer = require('express-sanitizer'),
      express = require('express'),
      mongoose = require('mongoose'),
      app = express();

//APP CONFIG
//connecting to DB
//MongoDB ATLAS url
url = "mongodb+srv://rohit:project@project-hjkgk.mongodb.net/test?retryWrites=true&w=majority"
//mongoose.connect("mongodb://localhost/restful_blog",{useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true}, (err, client)=>{
  if(err){
    console.log("Error occured!")
  }
  else{
    console.log("Connected to cloud DB")
  }
});

//setting view engine to ejs so don't have to specify ejs in render
app.set("view engine", "ejs");
//will serve css files from public dir
app.use(express.static("public"));
//allows nested objects to be parsed from url
app.use(bodyParser.urlencoded({extended:true}));
//app will look for _method in url and use that type(put, delete etc) of method instead of in form
app.use(methodOverride("_method"));
//app will sanitize user input to render html but no scripts
app.use(expressSanitizer());
//MONGOOSE CONFIG
const blogSchema = mongoose.Schema({
  title: String,
  body: String,
  image: String,
  created: {type: Date, default: Date.now}
});

//creates a representation model(collection?) loaded with Schema
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//   title: "Pizza on Front St is AMAZING",
//   body: "Delicious, thin crust, cheesy pepperoni & garlic fries",
//   image: "https://images.unsplash.com/photo-1525518392674-39ba1fca2ec2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
// });

//RESTFUL ROUTES

app.get("/", (req, res)=>{
  res.redirect("/blogs");
});

//INDEX route - shows all blogs
app.get("/blogs", (req,res)=>{
  Blog.find({}, (err, blogs)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render("index", {blogs: blogs});
    }
  });
});

//NEW route - form to create a new blog post
app.get("/blogs/new", (req, res)=>{
  res.render("new");
});

//CREATE route
app.post("/blogs", (req, res)=>{
//req.body is input in the url coming from form
  req.body.blog.body = req.sanitize(req.body.blog.body);
  //create new blog
  //redirect back to index page
  Blog.create(req.body.blog, (err, newBlog)=>{
    if(err){
      res.render("new");
    }
    else{
      res.redirect("/blogs");
    }
  });
});

//SHOW ROUTE
app.get("/blogs/:id", (req, res)=>{
  //retrieve from database
  Blog.findById(req.params.id, (err, blog)=>{
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.render("show", {blog: blog});
    }
  });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", (req, res)=>{
  Blog.findById(req.params.id, (err, foundBlog)=>{
    if(err){
      res.redirect("/blogs");
    }
    else{
      res.render("edit", {blog: foundBlog});
    }

  })
});

//UPDATE route
app.put("/blogs/:id", (req, res)=>{
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
    if(err){
      res.redirect("/blogs");
    }
    else {
      res.redirect("/blogs/" + req.params.id);
    }
  });
});


//DELETE ROUTE
app.delete("/blogs/:id", (req, res)=>{
  Blog.findByIdAndRemove(req.params.id, (err, deletedBlog)=>{
    //handle errors in better way later
    if(err){
      res.redirect("/blogs")
    }
    else{
      res.redirect("/blogs")
    }
  });
});

//setting up listening function
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Blog App Server Has Started!");
});

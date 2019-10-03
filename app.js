const bodyParser = require('body-parser'),
      express = require('express'),
      mongoose = require('mongoose'),
      app = express();

//APP CONFIG
//connecting to DB
mongoose.connect("mongodb://localhost/restful_blog",{useNewUrlParser: true, useUnifiedTopology: true});
//setting view engine to ejs so don't have to specify ejs in render
app.set("view engine", "ejs");
//will serve css files from public dir
app.use(express.static("public"));
//allows nested objects to be parsed from url
app.use(bodyParser.urlencoded({extended:true}));

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




//setting up listening function
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Blog App Server Has Started!");
});

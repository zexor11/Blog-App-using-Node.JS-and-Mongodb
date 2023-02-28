

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const mongoose = require("mongoose");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://127.0.0.1:27017/mongod?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.6.2/user1DB");
const user1Schema = {
  email: String,
  password: String
};


const User1 = new mongoose.model("User1", user1Schema);
app.get("/", (req, res) => {
  res.render("home");
})


const postSchema = {
  title: String,
  content: String
};

const Post = new mongoose.model("Post", postSchema);

app.get("/main", function(req, res){

  Post.find({}, function(err, posts){
    res.render("main", {
      posts: posts
      });
  });
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/main");
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login");
})


app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/register", function(req, res)  {
  const newUser1 = new User1 ({
    email: req.body.username,
    password: req.body.password

  });
  newUser1.save(function(err){
    if(err)
    {
      console.log(err);
    }
    else {
      res.render("compose")
    }
  }
  );
})

app.post("/login", function(req, res) { 
  const username = req.body.username;
  const password = req.body.password;

  User1.findOne({email: username}, function(err, foundUser) {
    if(err) {
      console.log(err);
    }
    else{
      if(foundUser) {
        if(foundUser.password === password) {
          res.render("compose")
        }
      }
    }
  });
});




/*app.get("/posts/:postId", function(req, res){
  const requestedTitle = req.params.postName;

  posts.forEach(function(post){
    const storedTitle = post.title;

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});*/


app.get("/posts/:postId", function(req, res){

  const requestedPostId = req.params.postId;
  
    Post.findOne({_id: requestedPostId}, function(err, post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });
  
  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const port = 80;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
}
const Article = mongoose.model("Article", articleSchema);

//Main Article
app.route("/articles")

.get(function(req, res){
  Article.find(function(err, results){
    if (!err){
      res.send(results);
    } else {
      res.send(err);
    }
  });
})

.post(function(req, res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article ({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
      if(!err){
        res.send("Successfully Deleted All Items!");
      } else { res.send(err);
      }
  });

})

.delete(function(req, res){
  Article.deleteMany(function(err){
    if (!err){
      res.send("No errors here!");
    } else {
      res.send(err);
    }
  });
});
//Main Article

//Specific Routes Made by user Within Article

app.route("/articles/:articleName")

.get(function (req, res){
  Article.findOne({title: req.params.articleName},function(err, results){
    if (results){
      res.send(results);
    } else {
      res.send("No Articles were found");
    }
  });
})

.put(function(req, res){
  Article.replaceOne(
    {title: req.params.articleName},
    {title: req.body.title, content: req.body.content},
    function(err){
      if (!err){
        res.send("Successfully Sent Over Data!");
      } else{
        res.send(err);
      }
    }
  );
})

.patch(function(req, res){
  Article.update(
    {title: req.params.articleName},
    {$set: req.body},
    function(err){
      if (!err){
        res.send("Successfully Patched Data!");
      } else{
        res.send(err);
      }
    }
  );
})

.delete(function(req, res){
  Article.remove(
    {title: req.params.articleName},
    function(err){
    if (!err){
      res.send("Successfully Deleted!");
    } else {
      res.send(err);
    }
  });
});


//Specific Routes Made by user Within Article
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

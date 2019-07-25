var express = require("express");
var router = express.Router();


var request = require("axios");
var cheerio = require("cheerio");

var Comment = require("../models/comment.js");
var Article = require("../models/article.js");

router.get("/", function(req, res) {
    res.redirect("/articles");
})

router.get("/scrape", function(req, res) {
    request("http://www.theverge.com").then(function(response) {
        console.log(response);
        var $ = cheerio.load(response.data);

        // An empty array to save the data that we'll scrape
        var titlesArray = [];

        $(".c-entry-box--compact__title").each(function(i, element) {

            var result = {};

            result.title = $(this).children("a").text();
            result.summary = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            if (result.title !== "" && result.summary !== "" && result.link !== "") {
                if (titlesArray.indexOf(result.title) == -1) {
                    titlesArray.push(result.title);

                    Article.count({ title: result.title }, function(err, test) {
                        if (test === 0) {
                            var entry = new Article(result);

                            entry.save(function(err, doc) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log(doc);
                                }
                            })
                        }
                    })
                } else {
                    console.log("article already exists");
                }
            } else {
                console.log("Not save to DB");
            }


        });
        res.redirect("/");
    });
});


router.get("/articles", function(req, res) {
    Article.find().sort({ _id: -1 }).exec(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            var artcl = { article: doc };
            console.log(artcl)
            res.render("index", artcl);
        }


    });
});

router.get("/articles-json", function(req, res) {
    Article.find({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            res.json(doc);
        }
    });
});

router.get("/clearAll", function(req, res) {
    Article.remove({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log("articles removed");
        }
    });
    res.redirect("/articles-json")
});

router.get("/readArticle/:id", function(req, res) {
    var articleId = req.params.id;
    var hbsObj = {
        article: [],
        body: []
    };

    Article.findOne({ _id: articleId }).populate("comment").then(function(doc) {
        if (err) {
            console.log(err);
        } else {
            hbsObj.article = doc;
            var link = doc.link;
            request(link, function(response) {
                var $ = cheerio.load(response);

                $(".l-col_main").each(function(response) {
                    hbsObj.body = $(this).children(".c-entry-content").children("p").text();

                    res.render("article", hbsObj);
                    return false;
                });
            });
        }
    });
});
router.post("/comment/:id", function(req, res) {
    var user = req.body.name;
    var content = req.body.comment;
    var articleId = req.params.id;

    var commentObj = {
        name: user,
        body: content
    };

    var newComment = new Comment(commentObj);

    newComment.save(function(err, doc) {
        if (err) {
            console.log(err)
        } else {
            console.log(doc._id);
            console.log(articleId);

            Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: doc._id } }, { new: true }).exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect("/readArticle/" + articleId);
                }

            });
        }
    });
});


module.exports = router;
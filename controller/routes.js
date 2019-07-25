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
    request("http://www.nytimes.com/section/us").then(function(response) {
        console.log(response);
        var $ = cheerio.load(response.data);

        // An empty array to save the data that we'll scrape
        var titlesArray = [];

        $("li.css-ye6x8s").each(function(i, element) {

            var result = {};


            result.title = $(element).find(".css-1cp3ece").find(".css-4jyr1y").find("a").find("h2").text();
            // $(this).children("a").text();
            result.summary = $(element).find(".css-1cp3ece").find(".css-4jyr1y").find("a").find("p").text();
            // $(this).parent("#content").children(".l-main-content").children(".c-entry-content").find(".l-col__main").find("a").find("p").text();
            // $(this).find("#content").find(".l-main-content").find(".c-entry-content").find(".l-col__main").find("a").find("p").text();
            // $(this).children("a").find("#content").find(".l-main-content").find(".c-entry-content").find(".l-col__main").find("p").text();
            // $(this).find("#content").find(".l-article-body-segment").find(".c-entry-content").text();
            // $(this).find("div.c-entry-content").text();
            // $(this).find(".l-col__main").find(".c-entry-content").find("p").text();
            result.link = `https://www.nytimes.com${$(element).find(".css-1cp3ece").find(".css-4jyr1y").find("a").attr("href")}`;
            // $(this).children("a").attr("href");

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



module.exports = router;
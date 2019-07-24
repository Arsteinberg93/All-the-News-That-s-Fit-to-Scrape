var express = require("express");
var app = express();
var path = require("path");

var request = require("request");
var cheerio = require("cheerio");

var Comment = require("../models/comment.js");
var Article = require("../models/article.js");

app.get("/", function(req, res) {
    res.redirect("/articles");
})

app.get("/scrape", function(req, res) {
    request("https://www.nytimes.com", function(error, response, html) {

        var $ = cheerio.load(html);

        // An empty array to save the data that we'll scrape
        var titlesArray = [];

        $("article").each(function(i, element) {

            var result = {};

            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

            if (result.title !== "" && result.link !== "") {
                if (titlesArray.indexOf(result.title) == -1) {
                    titlesArray.push(result.title);

                    Article.count({ title: result.title }, function(err, test) {
                        if (test === 0) {
                            var entry = new Article(result);

                            empty.save(function(err, doc) {
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
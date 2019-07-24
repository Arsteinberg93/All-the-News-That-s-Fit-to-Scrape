var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan")

var express = require("express")

var axios = require("axios");
var cheerio = require("cheerio");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

app.use(logger("dev"));
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(express.static(process.cwd() + "/public"));

var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/scrapedDB");
var db = mongoose.connection;




// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
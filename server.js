var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan")

mongoose.set('useCreateIndex', true);

var express = require("express");

var route = require("./controller/routes.js")

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


var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));

app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost:27017/scrapedDB", { useNewUrlParser: true });
var db = mongoose.connection;

app.use(route);



// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
var express = require('express');
var bodyParser = require('body-parser');
const basicAuth = require('express-basic-auth');
var path = require('path');
const sha256 = require('js-sha256');

var port = process.env.PORT || 3000;

// Create Express app
var app = express();
// Parse requests of content-type 'application/json'
app.use(bodyParser.json());

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;
const dbUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
var db;

// Initialize connection once
MongoClient.connect(dbUrl, function (err, database) {
    if (err) throw err;
    db = database.db("l18");
    app.listen(port, () => {
        console.log('Express app listening on port ' + port);
    });
});

//Serve static files (HTML, ...)
var root = path.normalize(__dirname + '/..');
app.use(express.static(path.join(root, 'client')));
app.set('appPath', 'client');

app.get("/frontend", (req,res) => {
    var relativeAppPath = req.app.get('appPath');
    var absoluteAppPath = path.resolve(relativeAppPath);
    res.sendFile(absoluteAppPath + '/frontend.html');
});

//Enable auth for all following endpoints
app.use(basicAuth({ authorizer: myAuthorizer, authorizeAsync: true }));

function myAuthorizer (username, pw, cb) {
    db.collection("users").findOne({ username: username }, function (err, user) {
        if (err || user === null) {
            cb(null, false);
        } else {
            if (sha256(pw) == user.hashPW) {
                cb(null, true);
            } else {
                cb(null, false);
            }
        }
    });
}

//This endpoint will require authentication
app.get('/', (req, res) => {
    res.status(200).send('Welcome');
});

// Error handler for all errors thrown by middlewares (e.g., by the basic auth mw)
var env = app.get('env');
app.use(function(err, req, res, next) {
    console.error(err.stack);
    var err_res = {
        "message": err.message,
        "error": {}
    };
    if (env === 'development') {
        err_res["error"] = err;
    }
    res.status(err.status || 500);
    res.json(err_res);
});

module.exports = app;

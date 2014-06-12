var http = require('http');
var fs = require('fs');
var path = require('path');
var express = require('express');
var request = require('request');

var app = express();
app.use('/styles',express.static(__dirname + '/app/styles'));
app.use('/scripts',express.static(__dirname + '/app/scripts'));
app.use('/bower_components',express.static(__dirname + '/bower_components'));


app.use(express.bodyParser());


app.get('/', function(req, res){
    fs.readFile(path.resolve(__dirname,"app/login.html"), function (err, data) {
    console.log(__dirname);
        if (err) {
            console.log(err);
            return;
        }
        var indexPage = data;
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(indexPage);
        res.end();
    });
});

app.post('/login',function(req, res) {
    var username = req.body.username;
    var password = req.body.password;
    console.log(username);
    console.log(password);


  request({
      uri: "http://10.253.80.246:3000/login",
      method: "POST",
      form: {
        username: username,
        password: password
      }
    },
    function(error, response, body) {
        var result = JSON.parse(body);
        console.log(result.length);
        if (result != undefined && result.length ===1 ){
                   res.writeHead(302, {Location: "/search",
                    "Access-Control-Allow-Origin": "*"});
            
        } else {
            res.writeHead(302, {Location: "/",
                    "Access-Control-Allow-Origin": "*"});

        }

        res.end();
    });

    
    //res.write("http://localhost:9768/search.html");
    
});

app.get('/search',function(req, res) {
    console.log("After redirect");
    fs.readFile(path.resolve(__dirname,"app/search.html"), function (err, data) {   
        if (err) {
            console.log(err);
            return;
        }
        var indexPage = data;
        res.writeHead(200, {"Content-Type":"text/html",
                    "Access-Control-Allow-Origin": "*"});
        res.write(indexPage);
        res.end();
    });

});


http.createServer(app).listen(9768, function(){
  console.log("Express server listening on port " + 9768);
});
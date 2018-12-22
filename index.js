
var MongoClient = require('mongodb').MongoClient;
const bodyParser =require('body-parser');

var express = require('express');
var app = express();
var url = "mongodb://localhost:27017/friendsdb";
var gDb;
var gDbo;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/friends/:userId', (req, res) => {
    let userId = parseInt(req.params.userId)
    gDbo.collection("tblFriends").findOne({"userId": userId}, function(err, result) {
        if (err) {
            res.send('Friend get : ' + false + err);
        }
        console.log('fetching')
        console.log(result.friends)
        res.send(result.friends);
    });
});

app.get('/friendsuggestions/:userid', (req, res) => {
    res.send('Hello friendsuggestions GET : ' + req.params.userid + '. MongoDB Environment Variable : ' + process.env.MONGO_DB);
});

app.post('/friends/:userId', (req, res) => {
    let userId = parseInt(req.params.userId)
    gDbo.collection("tblFriends").findOne({"userId": userId}, function(err, result) {
        if (err) {
            res.send("false");
        }
        console.log('fetching');
        gDbo.collection("tblFriends").findOne({"userId": req.body.userid}, function(err, fr) {
            if (err) {
                res.send("false");
            }
            console.log('fetching')
            
            result.friends.push({userId: req.body.userid, name: fr.userName });
            var myquery = { userId: userId };
            var newvalues = { $set: { friends: result.friends } };
            gDbo.collection("tblFriends").updateOne(myquery, newvalues, function(err, updateres) {
                if (err) {
                    res.send("false");
                }
                console.log("1 document updated");
                res.send("true");
            });
        });
    });
});

app.delete('/friends/:userid', (req, res) => {
    res.send('Hello friends DELETE : userid:' +  req.params.userid + '. FriendId : ' + req.body.friendid + '. MongoDB Environment Variable : ' + process.env.MONGO_DB);
});

app.listen(process.env.PORT || 3000, function () {
    console.log('Example app listening on port 3000!');
    console.log('inside init initializing db')
    MongoClient.connect(url, function(err, db) {
        gDb = db;
        if (err) throw err;
        var dbo = db.db("friendsdb");
        gDbo = dbo;
        dbo.createCollection("tblFriends", function(err, res) {
            if (err) throw err;
            console.log("Collection created!");
            // var myobj = { userId: 4, userName: 'testUserFour', age: 30, movieType: 'comedy', friends: [] };
            // dbo.collection("tblFriends").insertOne(myobj, function(err, res) {
            //   if (err) throw err;
            //   console.log("1 document inserted");
            // });
            //----------------------------------------------------------------------------
            // dbo.collection("tblFriends").findOne({"userId": 1}, function(err, result) {
            //     if (err) throw err;
            //     console.log('fetching')
            //     console.log(result);
            // });
            // db.close();
        });
    });
})



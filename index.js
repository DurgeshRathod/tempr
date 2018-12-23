
var MongoClient = require('mongodb').MongoClient;
const bodyParser =require('body-parser');
var http = require('https');
var express = require('express');

var app = express();
var url = process.env.DB_URL ||  "mongodb://localhost:27017/friendsdb";
var profileUrl =  process.env.PROFILE_URL ||  "localhost";
var profileUrlPort = process.env.PROFILE_URL_PORT || 3000;
var gDb;
var gDbo;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//GET FRIENDS
app.get('/friends/:userid', (req, res) => {
    let userid = req.params.userid;
    gDbo.collection("tblFriends").findOne({"userid": userid}, function(err, result) {
        if (err) {
            res.send('Friend get : ' + false + err);
        }
        if(!result ){
            res.send([]);
            return;
        }
        console.log('fetching')
        console.log(result.friends)
        res.send(result.friends);
    });
});

//GET FRIENDS SUGGESTIONS
app.get('/friendsuggestions/:userid', (req, res) => {
    var options = {
        host: profileUrl,
        port: profileUrlPort,
        path: '/profile/' + req.params.userid,
        type: 'get'
      };
      
     var getReq =  http.get(options, function(resp){
        resp.on('data', function(chunk){
          let userDetails = chunk;
          console.log('userDetails ' + JSON.stringify(userDetails));
          options.path = 'profile/' + process.env.CAP;
          options.type = 'post';
          var postReq = http.post(options, function(suggF){
              suggF.on('data', function(data){
                  console.log('suggested friends ' + JSON.stringify(data));
                  res.send(data);
              });
          }).on("error", function(err){
            console.log("Got error while fetching query result from profile: " + err.message);
            res.send([]);
          });

          postReq.write({age: userDetails.age, movietype: userDetails.movietype});

          postReq.extended();
        });
      }).on("error", function(e){
        console.log("Got error while fetching profile details: " + e.message);
        res.send([])
      });
      getReq.end();
    //res.send('Hello friendsuggestions GET : ' + req.params.userid + '. MongoDB Environment Variable : ' + process.env.MONGO_DB);
});

//MAKE FRIEND
app.post('/friends/:userid', (req, res) => {
    let userid = req.params.userid;
    let frienduser = {
        userid:req.body.friendid,
        name:req.body.friendname
    };
    gDbo.collection("tblFriends").findOne({"userid": userid}, function(err, result) {
        if (err) {
            res.send("false");
        }
        console.log('fetching');
        if(!result){
            result = {
                userid: userid,
                friends: []
            };
            result.friends.push(frienduser);
             gDbo.collection("tblFriends").insertOne(result, function(err, add) {
              if (err) throw err;
              console.log("1 document inserted");
              res.send("true")
            });
        }
        else {
            if(!result.friends) {
                result.friends = [];
            }
            result.friends.push(frienduser);
            var myquery = { userid: userid };
            var newvalues = { $set: { friends: result.friends } };
            gDbo.collection("tblFriends").updateOne(myquery, newvalues, function(err, updateres) {
                if (err) {
                    res.send("false");
                }
                console.log("1 document updated");
                res.send("true");
            });
        }
    });
});

//UNFRIEND
app.delete('/friends/:userid', (req, res) => {
    let userid = req.params.userid;
    gDbo.collection("tblFriends").findOne({"userid": userid}, function(err, result) {
        if (err) {
            res.send("false");
        }
        console.log('fetching');
        if(!result){
            res.send("true");
            return;
        }
        let index  = result.friends.findIndex(e => {
            if(e.userid == req.body.friendid) {
                return true;
            }
            else {
                return false;
            }
        });
        if(index > -1)
           result.friends.splice(index, 1);
        var myquery = { userid: userid };
        var newvalues = { $set: { friends: result.friends } };
        gDbo.collection("tblFriends").updateOne(myquery, newvalues, function(err, updateres) {
            if (err) {
                res.send("false");
            }
            console.log("1 document updated");
            res.send("true");
        });
    });
    //res.send('Hello friends DELETE : userid:' +  req.params.userid + '. FriendId : ' + req.body.friendid + '. MongoDB Environment Variable : ' + process.env.MONGO_DB);
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
            // var myobj = { userid: 4, userName: 'testUserFour', age: 30, movieType: 'comedy', friends: [] };
            // dbo.collection("tblFriends").insertOne(myobj, function(err, res) {
            //   if (err) throw err;
            //   console.log("1 document inserted");
            // });
            //----------------------------------------------------------------------------
            // dbo.collection("tblFriends").findOne({"userid": 1}, function(err, result) {
            //     if (err) throw err;
            //     console.log('fetching')
            //     console.log(result);
            // });
            // db.close();
        });
    });
})



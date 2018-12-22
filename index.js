
console.log('Testing...')
console.log(process.env.MONGO_DB);

const express = require('express'),
    app = express(),
    bodyparser = require('body-parser');

app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.send('Hello Express 2')
});

app.get('/friends/:userid', (req, res) => {
    res.send('Hello friends GET : ' + req.params.userid + '. MongoDB Environment Variable : ' + process.env.MONGO_DB);
});

app.get('/friendsuggestions/:userid', (req, res) => {
    res.send('Hello friendsuggestions GET : ' + req.params.userid + '. MongoDB Environment Variable : ' + process.env.MONGO_DB);
});

app.post('/friends/:userid', (req, res) => {
    res.send('Hello friends POST : userid:' +  req.params.userid + '. FriendId : ' + req.body.friendid + '. MongoDB Environment Variable : ' + process.env.MONGO_DB);
});

app.delete('/friends/:userid', (req, res) => {
    res.send('Hello friends DELETE : userid:' +  req.params.userid + '. FriendId : ' + req.body.friendid + '. MongoDB Environment Variable : ' + process.env.MONGO_DB);
});



app.listen(process.env.PORT || 3000)




console.log('Testing...')

const express = require('express'),
    app = express(),
    bodyparser = require('body-parser');

app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.send('Hellp Express 2')
});

app.get('/friends/:userid', (req, res) => {
    res.send('Hello friends GET : ' + req.params.userid)
});

app.get('/friendsuggestions/:userid', (req, res) => {
    res.send('Hello friendsuggestions GET : ' + req.params.userid)
});

app.post('/friends/:userid', (req, res) => {
    res.send('Hello friends POST : userid:' +  req.params.userid + '. FriendId : ' + req.body.friendid);
});

app.delete('/friends/:userid', (req, res) => {
    res.send('Hello friends DELETE : userid:' +  req.params.userid + '. FriendId : ' + req.body.friendid);
});

app.listen(process.env.PORT || 3000)



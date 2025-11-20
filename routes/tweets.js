var express = require('express');
var router = express.Router();
const moment = require("moment");

require('../models/connection');
const User = require('../models/users');
const Tweet = require('../models/tweets');

router.post('/create', (req, res)=>{
  // Créer un tweet
  User.findOne({ username: req.body.username })
    .then(user => {
        const newTweet = new Tweet({
          text: req.body.text,
          Date: new Date(),
          user: user._id,
        });
        
        newTweet.save().then(data => {
          res.json({ result: true, tweet: data });
        })
    })
    .catch(err => {
      res.json({ result: false, error: 'Server error' });
    });
  });

// Afficher tous les tweets
router.get('/',(req, res)=>{
    Tweet.find().then(data => {
        res.json(data)
    })
    .catch(err => {
      res.json({ result: false, error: 'Server error' });
    });
})

// Supprimer un tweet
router.delete('/delete/:id',(req, res)=>{
  Tweet.findByIdAndDelete(req.params.id)
  .then(data=>{
    res.json({ result: true, message: 'Tweet deleted' });
  })
  .catch(err => {
    res.json({ result: false, error: 'Server error' });
  });
})



module.exports = router;
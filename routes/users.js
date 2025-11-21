var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('../modules/checkbody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

// SIGN UP
router.post('/signup', (req, res)=>{
  // S'assurer que tous les champs sont renseignés
  if(!checkBody(req.body, ['firstname', 'username', 'password'])){
    res.json({ result: false, error: 'Missing or empty fields'});
    return;
  }
  // Check si le user n'est pas déjà enregistré
  User.findOne({ username: req.body.username })
    .then(data => {
      if(data){
        res.json({ result: false, error: 'User already exists' });
      } else {
  // Enregistrer le new user
        const hash = bcrypt.hashSync(req.body.password, 10);

        const newUser = new User({
          username: req.body.username,
          firstname: req.body.firstname,
          password: hash,
          token: uid2(32),
        });
        newUser.save().then(newDoc => {
          res.json({ result: true, token: newDoc.token });
        });     
      }
    })
    .catch(err => {
      res.json({ result: false, error: 'Server error' });
    });
});


// SIGN IN
router.post('/signin', (req, res)=>{
  // S'assurer que tous les champs sont renseignés
  if (!checkBody(req.body, ['username', 'password'])) {
    res.json({ result: false, error: 'Missing or empty fields' });
    return;
  }
  // S'assurer si le user existe dans la BDD
  User.findOne({ username: req.body.username })
    .then(data => {
      if(data && bcrypt.compareSync(req.body.password, data.password)){
        res.json({ result: true, token: data.token });
      } else {
        res.json({ result: false, error: 'User not found' });
      }
    })
    .catch(err => {
      res.json({ result: false, error: 'Server error' });
      });
})

// GET user connecté by token
router.get('/isConnected/:token', function(req, res, next) {
  User.findOne({ token: req.params.token }).then(data => {
    if (!data) {
      res.json({ result: false, error: 'User not found' });
    } 
    res.json({ result: true, token: data.token, firstname: data.firstname, username: data.username});
  })
  .catch(err => {
    res.json({ result: false, error: 'Server error' });
  });
})

module.exports = router;

var express = require('express');
var router = express.Router();

require('../models/connection');
const User = require('../models/users');
const { checkBody } = require('./modules/checkBody');
const uid2 = require('uid2');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/:token', function(req, res, next) {
  User.findOne({ token: req.params.token }).then(data => {
    if (data) {
      res.json({ result: true });
    } else {
      res.json({ result: false, error: 'User not found' });
    }
  });
});

module.exports = router;

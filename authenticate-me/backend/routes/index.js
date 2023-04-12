// backend/routes/index.js
// Connecting Express router
const express = require('express');
const router = express.Router();

// Test route
router.get('/hello/world', function(req, res) {

//   setting a cookie on the response   
  res.cookie('XSRF-TOKEN', req.csrfToken());
  res.send('Hello World!');
});

module.exports = router;
// backend/routes/index.js
// Connecting Express router
const express = require('express');
const router = express.Router();

// Test route
// router.get('/hello/world', function(req, res) {

// //   setting a cookie on the response   
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

// Add a XSRF-TOKEN cookie
router.get("/api/csrf/restore", (req, res) => {
  const csrfToken = req.csrfToken();
  res.cookie("XSRF-TOKEN", csrfToken);
  res.status(200).json({
    'XSRF-Token': csrfToken
  });
});


module.exports = router;
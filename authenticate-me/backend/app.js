// Import packages

const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Environment in production?
const { environment } = require('./config');
const isProduction = environment === 'production';

//Initialize express

const app = express();

//Connecting morgan middleware
app.use(morgan('dev'));

//Connecting cookie-parser and parsing JSON req.body middleware 
app.use(cookieParser());
app.use(express.json());

//Connecting security middlewares
// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }
  
  // helmet helps set a variety of headers to better secure your app
  app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
  );
  
  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
  );


  // connecting the exported router
const routes = require('./routes');

// Connect all the routes
app.use(routes); 

//export app
module.exports = app;

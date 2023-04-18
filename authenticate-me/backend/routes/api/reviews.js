// backend/routes/api/reviews.js
const express = require('express');
const { Op } = require('sequelize');
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');
const router = express.Router();



module.exports = router;
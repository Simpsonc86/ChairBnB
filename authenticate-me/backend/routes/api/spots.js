// backend/routes/api/spots.js
const express = require('express');
const {Op} = require('sequelize');
const {User,Spot,Booking,Review,ReviewImage,SpotImage} = require('../../db/models');
const router = express.Router();

// Get All Spots
router.get('/', async (req,res)=>{
    // let {page, size, lat, lng, price}=req.query;
    const where = {};
    const spots = await Spot.findAll({
        where,
        order:['id']
    });
    
    res.json(spots);



})

module.exports = router;
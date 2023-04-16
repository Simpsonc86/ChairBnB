// backend/routes/api/spots.js
const express = require('express');
const { Op } = require('sequelize');
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');
const router = express.Router();

// Get All Spots
router.get('/', async (req, res) => {

    const where = {};
    //query for all spots and all reviews and spot images associated with each spot
    const spots = await Spot.findAll({
        where,
        include: [{
            model: Review
        },
        {
            model: SpotImage
        },],
        order: ['id']
    });
    // console.log(typeof spots); //object

    ///////////add nested query object to an array to make it easier to work with using array methods
    let spotArr = [];

    //add each spot object to spotArr
    spots.forEach(spot => {
        spotArr.push(spot.toJSON())
    });

    //iterate through all spots in the spotArr
    for (let i = 0; i < spotArr.length; i++) {
        let starsSum = 0;
        let spotCount = 0;
        //iterate through all reviews of all spots in the spotArr
        for (let j = 0; j < spotArr[i].Reviews.length; j++) {
            //star rating for current review iteration
            // console.log(spotArr[i].Reviews[j].stars);

            //add the current review stars to sum
            starsSum += spotArr[i].Reviews[j].stars
            //increment number of reviews count
            spotCount++;
        }
        //find the average stars for each spot
        spotArr[i].avgRating = (starsSum / spotCount)


        //iterate through each Spot image to look for previewable images
        for (let k = 0; k < spotArr[i].SpotImages.length; k++) {

            //check if preview value of spot image is true
            if (spotArr[i].SpotImages[k].preview) {
                //set the preview image property to the spot image
                spotArr[i].previewImage = spotArr[i].SpotImages[k].url
            }
            //check if no preview image is found
            if (!spotArr[i].previewImage) {
                spotArr[i].previewImage = "No preview image available."
            }
        }

        // remove the included tables from all spots in the spotArr 
        delete spotArr[i].Reviews;
        delete spotArr[i].SpotImages;

    }

    res.json(spotArr);

})
// Get all details from a spot by spotId
router.get('/:spotId', async(req,res)=>{
    const where= {};
    let spot = await Spot.findByPk(req.params.spotId,{
        include:[
            {
                model:Review
            },
            {
                model:SpotImage,
                attributes:["id","url","preview"]
                
            },
            {
                model:User,
                // as:"Owner",
                attributes:["id","firstName","lastName"]
            },
        ],
    });

    if(!spot){
        res.status(404)
        res.json({message:"Spot couldn't be found!"})
    }else{

        spot =spot.toJSON();
        spot.Owner = spot.User;

        // calculate average stars from spot reviews and add to spot response object
        let starsSum = 0;
        let reviewsCount = 0;

        //get the sum of all stars and count of this spot's reviews
        spot.Reviews.forEach((review)=>{
            starsSum += review.stars;
            reviewsCount++;
        })
        spot.numReviews = reviewsCount;
        spot.avgStarRating = starsSum/reviewsCount;

        // remove unused table data from spot response object
        delete spot.User;
        delete spot.Reviews;

    }

    res.json(spot)
})
module.exports = router;
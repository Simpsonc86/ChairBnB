// backend/routes/api/spots.js
const express = require('express');
const { Op } = require('sequelize');
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');
const router = express.Router();

// Get All Spots
router.get('/', async (req, res) => {

    //destructure query params
    let{page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;

    const where = {};
    const errors = {};

    
    // set defaults for page and size if not specified
    if(!page)page=1;
    if(!size)size=20;

    // parse query param strings into int and floats
    page= parseInt(page);
    size= parseInt(size);
    minLat= parseFloat(minLat);
    maxLat= parseFloat(maxLat);
    minLng= parseFloat(minLng);
    maxLng= parseFloat(maxLng);
    minPrice= parseFloat(minPrice);
    maxPrice= parseFloat(maxPrice);


    //////handle validation errors for search filters
    if(page<=0||isNaN(page)){
        errors.page = 'Page must be greater than or equal to 1';
    }
    if(size<=0||isNaN(size)){
        errors.size = 'Size must be greater than or equal to 1';
    }
    //errors handling lat
    if(maxLat){
        if(maxLat<-90||maxLat>90||minLat>maxLat){
            errors.maxLat = "Maximum lattitude is invalid";
        }
    } 
    if(minLat){
        if(minLat<-90||minLat>90 ||minLat>maxLat){
        errors.minLat = "Minimum lattitude is invalid";
        }
    }
    //errors handling lng
    if(maxLng){
        if(maxLng<-180||maxLng>180||minLng>maxLng){
        errors.maxLng = "Maximum longitude is invalid";
        }
    }
    if(minLng){
        if(minLng<-180||minLng>180 ||minLng>maxLng){
        errors.minLng = "Minimum lattitude is invalid";
        }
    }

    //errors handling price
    if(maxPrice){
        if(maxPrice<0||minPrice>maxPrice){
        errors.maxPrice = "Maximum price must be greater than or equal to 0";
       }
    }
    if(minPrice){
        if(minPrice<0||minPrice>maxPrice){
            errors.minPrice = "Minimum price must be greater than or equal to 0";
        }
    }

    if(Object.keys(errors).length){
        return res.json({
            message: "Bad Request",
            errors
        });
    }

    
    //query for all spots and all reviews and spot images associated with each spot
    const spots = await Spot.findAll({
        ...where,
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
    /// used basic for loop for practice
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
        //find the average stars for each spot fixed to one decimal point
        spotArr[i].avgRating = parseFloat((starsSum / spotCount).toFixed(1));


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

        spotArr[i].price = parseInt(spotArr[i].price)

        // remove the included tables from all spots in the spotArr 
        delete spotArr[i].Reviews;
        delete spotArr[i].SpotImages;

    }

    res.json({"Spots":spotArr});

});

// Get all details from a spot by spotId
router.get('/:spotId', async (req, res) => {
    const where = {};

    // can refactor lazyload to redefine response object property order if needed
    let spot = await Spot.findByPk(req.params.spotId, {
        include: [
            {
                model: Review
            },
            {
                model: SpotImage,
                attributes: ["id", "url", "preview"]

            },
            {
                model: User,
                // as:"Owner",
                attributes: ["id", "firstName", "lastName"]
            },
        ],
    });

    if (!spot) {
        res.status(404)
        res.json({ message: "Spot couldn't be found!" })
    } else {

        spot = spot.toJSON();
        spot.Owner = spot.User;

        // calculate average stars from spot reviews and add to spot response object
        let starsSum = 0;
        let reviewsCount = 0;

        //get the sum of all stars and count of this spot's reviews
        spot.Reviews.forEach((review) => {
            starsSum += review.stars;
            reviewsCount++;
        })
        spot.numReviews = reviewsCount;
        const avgStarRtg = (starsSum / reviewsCount).toFixed(1);
        spot.avgStarRating = parseFloat(avgStarRtg);
        // const price = (spot.price).toFixed(0);
        spot.price = parseInt(spot.price);

        // remove unused table data from spot response object
        delete spot.User;
        delete spot.Reviews;

    }

    res.json(spot)
});

// Get all reviews by a Spot's id
router.get('/:spotId/reviews', async (req,res)=>{

    // const where = {}
    let reviews = await Review.findAll({
        where: {spotId: req.params.spotId},
        include:[
            {
                model:User,
                attributes: ["id", "firstName", "lastName"]
            },
            {
                model:ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    if(!reviews){
        res.status(404)
        res.json({ message: "Spot couldn't be found!" })
    }else{
        
    }

    res.json({"Reviews":reviews})

});
module.exports = router;
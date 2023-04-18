// backend/routes/api/spots.js
const express = require('express');
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');
const {check}= require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();


//Spot creation validation
const validateSpotCreation = [
    check("address")
        .exists({checkFalsy:true})
        .withMessage("Street address is required"),
    check("city")
        .exists({checkFalsy:true})
        .withMessage("City is required"),
    check("state")
        .exists({checkFalsy:true})
        .withMessage("State is required"),
    check("country")
        .exists({checkFalsy:true})
        .withMessage("Country"),
    check("lat")
        .isFloat({min:-90, max:90})
        .withMessage("Latitude is not valid"),
    check("lng")
        .isFloat({min:-180, max:180})
        .withMessage("Longitude is not valid"),
    check("name")
        .exists({max:50})
        .withMessage("Name is less than 50"),
    check("description")
        .exists({checkFalsy:true})
        .withMessage("Description is required"),
    check("price")
        .exists({checkFalsy:true})
        .withMessage("Price per day is required"),
    handleValidationErrors    
];

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
    minPrice= parseInt(minPrice);
    maxPrice= parseInt(maxPrice);

    // calcualte the page offset
    const offset = (page-1)*size;

    //////handle validation errors for search filters
    if(page<=0||isNaN(page)){
        errors.page = 'Page must be greater than or equal to 1';
    }
    if(size<=0||isNaN(size)){
        errors.size = 'Size must be greater than or equal to 1';
    }
    //errors handling lat
    if(maxLat||maxLat===0){
        if(maxLat<-90||maxLat>90||minLat>maxLat){
            errors.maxLat = "Maximum lattitude is invalid";
        }else{
            where.lat = {
                [Op.lte]:maxLat
            }
        }
    } 
    if(minLat||minLat===0){
        if(minLat<-90||minLat>90 ||minLat>maxLat){
        errors.minLat = "Minimum lattitude is invalid";
        }else{
            where.lat = {
                [Op.gte]:minLat
            }
        }
    }
    //errors handling lng
    if(maxLng||maxLng===0){
        if(maxLng<-180||maxLng>180||minLng>maxLng){
        errors.maxLng = "Maximum longitude is invalid";
        }else{
            where.lng = {
                [Op.lte]:maxLng
            }
        }
    }
    if(minLng||minLng===0){
        if(minLng<-180||minLng>180 ||minLng>maxLng){
        errors.minLng = "Minimum longitude is invalid";
        }else{
            where.lng = {
                [Op.gte]:minLng
            }
        }
    }
    //errors handling price
    if(maxPrice||maxPrice===0){
        if(maxPrice<0||minPrice>maxPrice){
        errors.maxPrice = "Maximum price must be greater than or equal to 0";
        }else{
            where.price = {
                [Op.lte]:maxPrice
            }
        }
    }
    if(minPrice||minPrice===0){
        if(minPrice<0||minPrice>maxPrice){
            errors.minPrice = "Minimum price must be greater than or equal to 0";
        }else{
            where.price = {
                [Op.gte]:minPrice
            }
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
        where,
        include: [{
            model: Review
        },
        {
            model: SpotImage
        },],
        offset:offset,
        limit:size,
        order: ['id'],
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
        //parse float to int
        spotArr[i].price = parseInt(spotArr[i].price)

        // remove the included tables from all spots in the spotArr 
        delete spotArr[i].Reviews;
        delete spotArr[i].SpotImages;

    }
    res.status(200);
    res.json({"Spots":spotArr,
   "page":page,
   "size":size
});

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
    }
    
    res.json({"Reviews":reviews})

});

// Create a spot

router.post('/',[requireAuth, validateSpotCreation] ,async(req,res)=>{
    const {user} = req;
    if(user){
        const {address,city,state,country,lat,lng,name,description,price} = req.body;

        const newSpot = await Spot.create({
            ownerId: user.id,
            address,city,state,country,lat,lng,name,description,price
        });

        res.status(201);
        res.json(newSpot);
    }
});
module.exports = router;
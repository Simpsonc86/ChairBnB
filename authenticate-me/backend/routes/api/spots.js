// backend/routes/api/spots.js
const express = require('express');
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');
const { multipleFilesUpload, multipleMulterUpload, retrievePrivateFile } = require("../../awsS3");

const router = express.Router();

//Review creation validation
const validateReviewCreation = [
    check("review")
        .exists({checkFalsy:true})
        .withMessage("Review text is required"),
    check("stars")
        .isFloat({min:1, max:5})
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]

//Booking creation validation
const validateBookingCreation = [
    check("startDate")
        .exists({ checkFalsy: true })
        .isDate()
        .withMessage("Start date is invalid format YYYY/MM/DD"),
    check("endDate")
        .exists({ checkFalsy: true })
        .isDate()
        .withMessage("End date is invalid format YYYY/MM/DD"),
    handleValidationErrors
];

//Spot creation validation
const validateSpotCreation = [
    check("address")
        .exists({ checkFalsy: true })
        .withMessage("Street address is required"),
    check("city")
        .exists({ checkFalsy: true })
        .withMessage("City is required"),
    check("state")
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    check("country")
        .exists({ checkFalsy: true })
        .withMessage("Country is required"),
    check("lat")
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude is not valid"),
    check("lng")
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude is not valid"),
    check("name")
        .exists({ max: 50 })
        .withMessage("Name is less than 50 characters"),
    check("description")
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    check("price")
        .exists({ checkFalsy: true })
        .withMessage("Price per day is required"),
    handleValidationErrors
];
// AWS UPLOAD CODE////////////////////////////////////
router.get(
    '/:spotId/images',
    async (req, res) => {
      const images = await SpotImage.findAll({where: { spotId: req.params["spotId"] }});
      const imageUrls = images.map(image => retrievePrivateFile(image.url));
      return res.json(imageUrls);
    }
  );

//   router.post(
//     '/:spotId/',
//     multipleMulterUpload("images"),
//     async (req, res) => {
//       const { spotId } = req.params;
//       const keys = await multipleFilesUpload({ files: req.files });
//       const images = await Promise.all(
//         keys.map(key => SpotImage.create({ key, spotId }))
//       );
//       const imageUrls = images.map(image => retrievePrivateFile(image.key));
//       return res.json(imageUrls);
//     }
//   );
  
/////////////////////////////////////////////////


// Add an image to spot based on spot id
router.post('/:spotId/images', [ multipleMulterUpload("images"),requireAuth], async (req, res) => {
    // const { user } = req;
    let {spotId} = req.params;
    spotId = Number(spotId)
    console.log('hitting the backend------------------');
    console.log('hitting the backend------------------spotId',req.params.spotId);
    // console.log('hitting the backend------------------user',user);

    // const spot = await Spot.findByPk(req.params.spotId);
    console.log("Line 105 in routes/api/spots... Files passed in from multipleFilesUpload",req.files);
    const keys = await multipleFilesUpload({ files: req.files });

    console.log("keys from multipleFilesUpload:  ", keys);
      const images = await Promise.all(
        keys.map(key => SpotImage.create({ spotId,url:key, preview:true }))
      );
    //   console.log("image from inside post route :" , images);
    //   const imageUrls = images.map(image => image.url);
    //   console.log("image urls from inside post route :" , images);
      res.status(200);
      return res.json(images);

    // // spot not found
    // if (!imageUrls) {
    //     res.status(404);
    //     return res.json({
    //         message: "Spot couldn't be found"
    //     });
    // }
    // // if user is the owner of spot add image to spot, else throw forbidden error
    // if (user.id === spot.ownerId) {
    //     const { url, preview } = req.body;
    //     console.log('This is the url------',url,'this the preview------',preview);

    //     const addImage = await SpotImage.create({
    //         spotId: spot.id,
    //         url, preview
    //     });
    //     res.status(200);
    //     return res.json({ 'id': addImage.id, 'url': addImage.url, 'preview': addImage.preview });
    // } else {
    //     res.status(403)
    //     return res.json({ message: "Forbidden" });
    // }
});

// Get all spots by current user
router.get('/current', [requireAuth], async (req, res) => {
    const { user } = req;
    let spotArr = [];
    const where = {
        ownerId: req.user.id
    }

    const spots = await Spot.findAll({
        where,
        include: [
            {
                model: Review
            },
            {
                model: SpotImage
            }
        ]
    });

    const prevImg = await SpotImage.findOne({
        where:{
            preview:true
            },
            attributes:['url']
    })
    // refactor from get all spots
    spots.forEach((spot) => {
        spotArr.push(spot.toJSON());
    });
    spotArr.forEach((spot) => {

        //authorize user
        if (user.id === spot.ownerId) {

            //calculate avg star rating for each spot
            let starSum = 0;
            let reviewCount = 0;

            //iterate through all reviews for each spot
            spot.Reviews.forEach((review) => {
                //add current review's stars to to sum.
                starSum += review.stars;
                //increment the number of reviews
                reviewCount++;
            });
            //parse avg to float with two decimal points
            spot.avgRating = Number.parseFloat((starSum / reviewCount).toFixed(2));

            spot.SpotImages.forEach((image) => {
                spot.price= Number.parseFloat(spot.price.toFixed(2))
                if (prevImg) {
                    return spot.previewImage = prevImg.url;
                }else{
                    spot.previewImage = "No preview"
                }
            });

            delete spot.Reviews;
            delete spot.SpotImages;

        }
    });

    res.status(200);
    res.json({
        "Spots": spotArr
    })
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
        //assign object properties for numReviews and avgStarRating
        spot.numReviews = reviewsCount;
        const avgStarRtg = starsSum / reviewsCount;
        spot.avgStarRating = Number.parseFloat(avgStarRtg.toFixed(2));
        // const price = (spot.price).toFixed(0);
        // spot.price = spot.price;

        // remove unused table data from spot response object
        delete spot.User;
        delete spot.Reviews;

    }

    res.json(spot)
});


// Create a booking from a spot based on spot id
router.post('/:spotId/bookings', [requireAuth, validateBookingCreation], async (req, res) => {
    let spotId= req.params.spotId;
    const { startDate, endDate } = req.body;

    // get spot based on url
    const spot = await Spot.findByPk(req.params.spotId);

    // spot not found
    if (!spot) {
        res.status(404);
        return res.json({ message: "Spot couldn't be found" });
    }

    ///////////////booking conflicts//////////
    // user cannot own spot
    if (spot.ownerId === req.user.id) {
        res.status(403);
        return res.json({ message: "Spot must not belong to current user!" });
    }
    // convert dates to number to compare
    const bookingStart = new Date(startDate).getTime();
    const bookingEnd = new Date(endDate).getTime();
    const currentDate = new Date().getTime();

    // booking cannot start in the past
    if (bookingStart < currentDate) {
        res.status(400);
        return res.json({ message: "Start date must be in the future" })
    }
    // end date cannot be before start date
    if (bookingStart > bookingEnd) {
        res.status(400);
        return res.json({ message: "End date is before start date. Booking invlaid" })
    }

    // check if there is an existing booking
    const existing = await Booking.findOne({
        where: {
            spotId: req.params.spotId,
            startDate: {
                [Op.lt]: endDate
            },
            endDate: {
                [Op.gt]: startDate
            },
        }
    });

    // error handle overlapping start or end dates with existing booking
    if (existing) {

        const errors = {}

        if (existing.startDate.getTime() <= bookingStart ) {
            errors.startDate = "Start date overlaps another booking"
        }
        if (existing.endDate.getTime() <= bookingEnd ) {
            errors.endDate = "End date overlaps another booking"
        }

        res.status(400);
        return res.json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: { ...errors }
        });
    }

    // parse spot id from url
    spotId = parseInt(spotId)

    // create new booking
    const newBooking = await Booking.create({
        spotId,
        userId: req.user.id,
        startDate,
        endDate
    });

    res.status(200);
    res.json(newBooking);
});

// Get all bookings for a spot based on spot id
router.get("/:spotId/bookings", [requireAuth], async (req, res) => {

    const userId = req.user.id;
    let bookArr = [];

    //find the spot by id given in params 
    const spot = await Spot.findByPk(req.params.spotId);

    //spot not found
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        });
    }

    // query for all bookings for the requested spot
    const bookings = await Booking.findAll({
        where: {
            spotId: req.params.spotId
        },
        include: {
            model: User,
            attributes: ["id", "firstName", "lastName"]
        }
    });

    // turn bookings into POJOs
    bookings.forEach((book) => {
        book = book.toJSON()
    });

    
    bookings.forEach((book) => {
        const bookDetails = {}
        //if current user is spot owner show the booking's user details
        if (userId === spot.ownerId) {
            bookDetails.User = book.User,
            bookDetails.id = book.id,
            bookDetails.spotId = book.spotId,
            bookDetails.userId = book.User.id,
            bookDetails.startDate = book.startDate,
            bookDetails.endDate = book.endDate,
            bookDetails.createdAt = book.createdAt,
            bookDetails.updatedAt = book.updatedAt
        }
        // if not spot owner then show bookings for spot only
        else{
            bookDetails.spotId = book.spotId,
            bookDetails.startDate = book.startDate,
            bookDetails.endDate = book.endDate
        }

        bookArr.push(bookDetails)


    });

    res.status(200);
    return res.json({
        Bookings: bookArr
    })



});

// Get all reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    
    let spot = await Spot.findByPk(req.params.spotId);
    if(!spot){
        res.status(404)
        return res.json({ message: "Spot couldn't be found!" })
    }
    // const where = {}
    let reviews = await Review.findAll({
        where: { spotId: req.params.spotId },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            },
            {
                model: ReviewImage,
                attributes: ['id', 'url']
            }
        ]
    });

    return res.json({ "Reviews": reviews })

});

// Create a Review for a Spot based on spot id
router.post('/:spotId/reviews',[requireAuth,validateReviewCreation],async (req,res)=>{
    const {user} = req;
    const {review,stars} = req.body;
    
    //find spot by id in req params 
    const spot = await Spot.findByPk(req.params.spotId);

    //spot not found
    if(!spot){
        res.status(404);
        return res.json({
            message:"Spot couldn't be found"
        });
    }
    // is there an existing review from user?
    const existing = await Review.findOne({
        where:{
            userId: user.id,
            spotId: req.params.spotId
        }
    });
    
    //user has already reviewed spot
    if(existing){
        res.status(403);
        return res.json({
            message: "User already has a reveiw for this spot"
        });
    }
    //create new review
    const newReview = await Review.create({
        userId: user.id,
        spotId:req.params.spotId,
        review,stars
    });

    res.status(201);
    return res.json(newReview);
})

// Edit a spot
router.put('/:spotId', [requireAuth, validateSpotCreation], async (req, res) => {
    const { user } = req;
    const spot = await Spot.findByPk(req.params.spotId);

    //if spot is not found return error
    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found",
        });
    }
    // authenticate user if correct owner of spot
    if (user.id === spot.ownerId) {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const updatedSpot = await spot.update({
            address, city, state, country, lat, lng, name, description, price
        });

        res.status(200);
        res.json(updatedSpot);
    }
    // if not correct owner of spot
    else {
        res.status(403);
        res.json({ message: "Forbidden" })

    }

});

// Delete a spot
router.delete('/:spotId', [requireAuth], async (req, res) => {
    const { user } = req;
    let spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        res.status(404);
        return res.json({
            message: "Spot couldn't be found"
        });
    }

    if (user.id === spot.ownerId) {
        await spot.destroy();
        res.status(200);
        res.json({
            message: "Successfully deleted"
        });
    }
    else {
        res.status(403);
        res.json({
            message: "Forbidden"
        });
    }
});

// Create a spot
router.post('/', [requireAuth, validateSpotCreation], async (req, res) => {
    const { user } = req;
    if (user) {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

        const newSpot = await Spot.create({
            ownerId: user.id,
            address, city, state, country, lat, lng, name, description, price
        });

        res.status(201);
        res.json(newSpot);
    }
});

// Get All Spots
router.get('/', async (req, res) => {

    //destructure query params
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    const where = {};
    const errors = {};


    // set defaults for page and size if not specified
    if (!page) page = 1;
    if (!size) size = 20;

    // parse query param strings into int and floats
    page = Number.parseInt(page);
    size = Number.parseInt(size);
    minLat = Number.parseFloat(minLat);
    maxLat = Number.parseFloat(maxLat);
    minLng = Number.parseFloat(minLng);
    maxLng = Number.parseFloat(maxLng);
    minPrice = Number.parseFloat(minPrice);
    maxPrice = Number.parseFloat(maxPrice);

    // calcualte the page offset
    const offset = (page - 1) * size;

    //////handle validation errors for search filters
    if (page <= 0 || isNaN(page)) {
        errors.page = 'Page must be greater than or equal to 1';
    }
    if (size <= 0 || isNaN(size)) {
        errors.size = 'Size must be greater than or equal to 1';
    }
    //errors handling lat
    if (maxLat || maxLat === 0) {
        if (maxLat < -90 || maxLat > 90 || minLat > maxLat) {
            errors.maxLat = "Maximum lattitude is invalid";
        } else {
            where.lat = {
                [Op.lte]: maxLat
            }
        }
    }
    if (minLat || minLat === 0) {
        if (minLat < -90 || minLat > 90 || minLat > maxLat) {
            errors.minLat = "Minimum lattitude is invalid";
        } else {
            where.lat = {
                [Op.gte]: minLat
            }
        }
    }
    //errors handling lng
    if (maxLng || maxLng === 0) {
        if (maxLng < -180 || maxLng > 180 || minLng > maxLng) {
            errors.maxLng = "Maximum longitude is invalid";
        } else {
            where.lng = {
                [Op.lte]: maxLng
            }
        }
    }
    if (minLng || minLng === 0) {
        if (minLng < -180 || minLng > 180 || minLng > maxLng) {
            errors.minLng = "Minimum longitude is invalid";
        } else {
            where.lng = {
                [Op.gte]: minLng
            }
        }
    }
    //errors handling price
    if (maxPrice || maxPrice === 0) {
        if (maxPrice < 0 || minPrice > maxPrice) {
            errors.maxPrice = "Maximum price must be greater than or equal to 0";
        } else {
            where.price = {
                [Op.lte]: maxPrice
            }
        }
    }
    if (minPrice || minPrice === 0) {
        if (minPrice < 0 || minPrice > maxPrice) {
            errors.minPrice = "Minimum price must be greater than or equal to 0";
        } else {
            where.price = {
                [Op.gte]: minPrice
            }
        }
    }



    if (Object.keys(errors).length) {
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
        offset: offset,
        limit: size,
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
        spotArr[i].avgRating = Number.parseFloat((starsSum / spotCount).toFixed(2));


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
        // spotArr[i].price = parseInt(spotArr[i].price)

        // remove the included tables from all spots in the spotArr 
        delete spotArr[i].Reviews;
        delete spotArr[i].SpotImages;

    }
    res.status(200);
    res.json({
        "Spots": spotArr,
        "page": page,
        "size": size
    });

});

module.exports = router, validateReviewCreation;
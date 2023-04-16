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
        include:[{
            model:Review
        },
        {
            model:SpotImage
        },],
        order:['id']
    });
    let spotArr = [];
    //add each spot to the spotArr
    spots.forEach(spot => {
        spotArr.push(spot.toJSON())
    });
    //iterate through each spot in the spotArr
    for(let i =0; i< spotArr.length; i++){
        let sum = 0;
        let count = 0;
        //iterate through each review of each spot
        for(let j = 0;j<spotArr[i].Reviews.length; j++){
            //star rating for current review iteration
            // console.log(spotArr[i].Reviews[j].stars);

            //add the current review stars to sum
            sum += spotArr[i].Reviews[j].stars
            //increment number of reviews count
            count++;
        }
       // find the average stars for each spot
        spotArr[i].avgRating = (sum/count)


        //iterate through each Spot image to look for previewable images
        for(let k =0; k<spotArr[i].SpotImages.length; k++){

            //check if preview value of spot image is true
            if (spotArr[i].SpotImages[k].preview){
                //set the preview image property to the spot image
                spotArr[i].previewImage = spotArr[i].SpotImages[k].url
            }
            //if no preview image is found
            if (!spotArr[i].previewImage){
                spotArr[i].previewImage="No preview image available."
            }
        }
      
        // remove the included tables from each spot's response object
        delete spotArr[i].Reviews;
        delete spotArr[i].SpotImages;
        
    }
   
    res.json(spotArr);

})

module.exports = router;
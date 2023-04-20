const express = require('express');
const {Review, ReviewImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const router = express.Router();

// delete review image by image id
router.delete("/:imageId", [requireAuth], async (req,res)=>{
    const{user}=req;
     let image = await ReviewImage.findByPk(req.params.imageId);


     //image not found
    if(!image){
        res.status(400);
        return res.json({message:"Review Image couldn't be found"});
    }
    // find the review that the image belongs to
    const review = await Review.findOne({
        where:{
            id:image.reviewId
        }
    });

    //if review owner is the current user then delete image
    // console.log(review.userId);
    if (review.userId === req.user.id){
        await image.destroy();        
        res.status(200);
        return res.json({
            message:"Successfully deleted"
        });
    }
    // user not review owner
    else{
        res.status(403);
        return res.json({
            message:"Forbidden"
        });
    }


});

module.exports = router;
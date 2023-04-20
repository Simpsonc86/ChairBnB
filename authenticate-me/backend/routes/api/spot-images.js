const express = require('express');
const {Spot, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

// delete spot image by image id
router.delete('/:imageId', [requireAuth], async (req,res)=>{
    const{user}=req;
    let image = await SpotImage.findByPk(req.params.imageId);


    //image not found
    if(!image){
        res.status(400);
        return res.json({message:"Spot Image couldn't be found"});
    }
    // find the spot that the image belongs to
    const spot = await Spot.findOne({
        where:{
            id:image.spotId
        }
    });

    //if spot owner is the current user then delete image
    if (spot.ownerId === req.user.id){
        await image.destroy();        
        res.status(200);
        return res.json({
            message:"Successfully deleted"
        });
    }
    // user not spot owner
    else{
        res.status(403);
        return res.json({
            message:"Forbidden"
        });
    }

});
module.exports = router;
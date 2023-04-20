// backend/routes/api/reviews.js
const express = require('express');
const { Op } = require('sequelize');
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const router = express.Router();

// Get all reviews of the Current User
router.get("/current", [requireAuth], async (req, res) => {
    const { user } = req;
    let reviewArr = [];

    //get all reviews that belong to user with correct details
    const reviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [
            {
                model: User,
                attributes: ["id", "firstName", "lastName"]
            },
            {
                model: Spot,
                attributes: {
                    exclude: ["description", "createdAt", "updatedAt"]
                },
                include: [
                    {
                        model: SpotImage,
                        attributes: ["url"]
                    },
                ],
            },
            {
                model: ReviewImage,
                attributes: ["id", "url"]
            }
        ]
    });

    // turn each review into pojo
    reviews.forEach(review => {
        reviewArr.push(review.toJSON())
    });

    reviewArr.forEach((review) => {

        review.Spot.SpotImages.forEach((img) => {
            if (img.preview) {
                return review.previewImage = img.url;
            }
        });
        review.Spot.price = parseInt(review.Spot.price)

        delete review.Spot.SpotImages;
    });
    //authorized user?
    if (user.id === review.userId) {
        res.status(200);
        return res.json({
            Reviews: reviewArr
        })
    }
    //throw error for unauthorized user
    else {
        res.status(403)
        res.json({
            message: "Forbidden"
        })
    }

});

module.exports = router;
// backend/routes/api/reviews.js
const express = require('express');
const { Op } = require('sequelize');
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');
const { requireAuth } = require('../../utils/auth')
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
// const { validateReviewCreation } = require('../api/spots')
const router = express.Router();

const validateReview = [
    check("review")
        .exists({checkFalsy:true})
        .withMessage("Review text is required"),
    check("stars")
        .isInt({min:1, max:5})
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]

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

// Edit a review
router.put('/:reviewId', [requireAuth, validateReview], async (req, res) => {
    const { user } = req;
    const { review, stars } = req.body;
    // find the review
    let oldReview = await Review.findOne({
        where: {
            id:req.params.reviewId
        },
        include: [
            {
                model: User,
            },
            {
                model: Spot,
            }
        ]
    });

    // if review is not found return error
    if (!oldReview) {
        res.status(404);
        return res.json({
            message: "Review couldn't be found"
        });
    }

    //authenticate user if correct owner of review
    if (user.id !== Spot.ownerId) {
        await oldReview.update({
            review: review,
            stars: stars
        });
        oldReview = oldReview.toJSON();
        oldReview.userId = oldReview.User.id
        oldReview.spotId = oldReview.Spot.id

        delete oldReview.User;
        delete oldReview.Spot;

        res.status(200);
        return res.json(oldReview)
    }
    else {
        res.status(403)
        return res.json({
            message: "Forbidden"
        });
    }
});

// Delete a review
router.delete("/:reviewId", [requireAuth], async (req,res)=>{
    const { user } = req;
    let review = await Review.findByPk(req.params.reviewId);

    if (!review) {
        res.status(404);
        return res.json({
            message: "review couldn't be found"
        });
    }

    if (user.id === review.userId) {
        await review.destroy();
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
module.exports = router;
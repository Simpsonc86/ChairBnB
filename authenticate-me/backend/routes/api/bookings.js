// backend/routes/api/spots.js
const express = require('express');
const { User, Spot, Booking, Review, ReviewImage, SpotImage } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');
const { check } = require('express-validator')
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize');

const router = express.Router();

//Get all of the current user's bookings
router.get('/current', [requireAuth], async (req, res) => {

    const { user } = req;

    const bookings = await Booking.findAll({

        where: {
            userId: user.id
        },
        include: [
            {
                model: Spot,
                attributes: {
                    exclude: ["description", "createdAt", "updatedAt"]
                },
                //old code: find spot images by eagerloading
                include: [
                    {
                        model: SpotImage,
                        where:{
                            preview:true
                        },
                        attributes:['url']
                    }
                ]
            }
        ]

    });

    // const previewImg = await SpotImage.findOne({
    //     where:{}
    // })

    let bookArr = [];

    bookings.forEach((booking) => {
        bookArr.push(booking.toJSON())
    });

    bookArr.forEach((booking) => {
        console.log(booking.Spot);
        booking.Spot.SpotImages.forEach((img)=>{
            if(img.url){
                booking.Spot.previewImage = img.url
            }

            delete booking.Spot.SpotImages;
        })
    })

    res.status(200);
    res.json({ "Bookings": bookArr })
});

// Delete authorized user booking by booking id
router.delete('/:bookingId', [requireAuth], async (req, res) => {
    const { user } = req;

    //find the booking by Id and spot by booking spotId
    const booking = await Booking.findByPk(req.params.bookingId);
    const spot = await Spot.findByPk(booking.spotId);

    //no booking found
    if (!booking) {
        res.status(404);
        return res.json({ message: "Booking couldn't be found" });
    }

    // booking is not owned by user or spot is not owned by user
    if (booking.userId !== user.id && spot.ownerId !== user.id) {
        res.status(403);
        res.json({
            message: "Forbidden"
        });
    }

    //check if start date has begun already
    const now = new Date().getTime();
    const start = new Date(booking.startDate).getTime();

    if (start < now) {
        res.status(403);
        return res.json({ message: "Bookings that have been started can't be deleted" })
    }

    await booking.destroy();
    return res.json({ message: "Successfully Deleted" })




})

// Edit a booking by booking id
router.put('/:bookingId', [requireAuth], async (req, res) => {
    const { user } = req;
    const{startDate,endDate}=req.body;

    const booking = await Booking.findByPk(req.params.bookingId);

    //booking not found
    if (!booking) {
        res.status(400);
        res.json({
            message: "Booking couldn't be found"
        });
    }

    //user doesn't own booking
    if (user.id !== booking.userId) {
        res.status(403);
        return res.json({
            message: "Forbidden"
        })
    }

    //check if booking ended. if so, cannot edit
    const now = new Date().getTime();
    const bookEnd = new Date(booking.endDate).getTime();

    if (bookEnd < now) {
        res.status(403)
        res.json({ message: "Past bookings can't be modified" });
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    //conflict
    if (end <= start) {
        res.status(400)
        return res.json({
            message: "Bad Request",
            errors: {
                endDate: "endDate cannot be on or before startDate"
            }
        })
    }

    // look for previous booking within start and end dates
    const prevBook = await Booking.findOne({
        where: {
            spotId: booking.spotId,
            startDate: {
                [Op.lt]: endDate
            },
            endDate: {
                [Op.gt]: startDate
            },
            // do not find the same booking
            id: {
                [Op.not]: booking.id
            }
        }
    });

    // booking exist between given start and end dates
    if (prevBook) {
        res.status(403);
        return res.json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
                startDate: "Start date conflicts with an existing booking.",
                endDate: "End date conflicts with an existing booking."
            }
        });
    }

    else {

        await booking.update({startDate, endDate});
    }
    return res.json(booking)
});

module.exports = router;
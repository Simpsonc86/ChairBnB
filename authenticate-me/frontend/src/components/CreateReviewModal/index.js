import { useDispatch } from "react-redux";
import { createReviewThunk, getAllSpotReviewsThunk } from "../../store/reviews";
import { useState } from 'react'
import { useModal } from "../../context/Modal";
import { getSpotThunk } from "../../store/spot"
// import { useEffect } from "react";
import './CreateReviewModal.css'
import { useHistory } from "react-router-dom";

function CreateReviewModal({ spotId }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const { closeModal } = useModal();
    const [review, setReview] = useState('');
    const [rating, setRating] = useState(0);
    const [errors, setErrors] = useState({})

    // console.log('spot id from prop:',typeof spotId,spotId);
    const STARS = [1.00, 2.00, 3.00, 4.00, 5.00]

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errObj = {}
        if (review.length < 10) errObj.review = "Please write at least 10 characters";
        if (rating < 1.00) errObj.rating = "Please select more than 0 stars";
        console.log('rating from user', rating);

        if (!Object.values(errObj).length) {
            const newReview = await dispatch(createReviewThunk({ review, stars: rating }, Number(spotId)));

            // console.log('this is the created review', newReview);

            if (newReview) {
                await dispatch(getSpotThunk(spotId))
                    .then(dispatch(getAllSpotReviewsThunk(spotId)))
                    .then(() => closeModal());
            }


        } else setErrors(errObj);

        // history.push(`/spots/${spotId}`)

    }


    return (
        <div className="create-review-box">
            <h1 className="review-modal-title">How was your stay?</h1>
            {/* {!!Object.values(errors).length && <p className="errors">{errors.message}</p>} */}
                {errors.review && <p className="errors">{errors.review}</p>}    
                {errors.rating && <p className="errors">{errors.rating}</p>}    
            <form className="review-form" onSubmit={handleSubmit}>
                <textarea
                    className="review-modal-description"
                    rows='5'
                    type='text'
                    placeholder="Leave your review here..."
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                ></textarea>
                <div className="review-rating">
                    <div className="review-stars">
                        {STARS.map((numStars, idx) => {
                            return (
                                <span key={idx} className='star-row' id={numStars > rating ? 'filled' : 'empty'}
                                    onMouseEnter={() => setRating(rating)}
                                    onClick={() => setRating(numStars)}
                                >
                                    {/* {console.log('this is the star rating',rating)} */}
                                    <i className='fa-solid fa-star clickable'></i>
                                </span>
                            )
                        })}
                        
                        &nbsp;

                        <span className="star-label">{rating} {rating>1?"Stars":"Star"}</span>
                    </div>


                </div>
                <br />

                <div className="submit-review-btn">
                    <button id='submit-review' >Submit Your Review</button>

                </div>


            </form>

        </div>
    )
}

export default CreateReviewModal
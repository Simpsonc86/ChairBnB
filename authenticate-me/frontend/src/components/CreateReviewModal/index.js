import { useDispatch } from "react-redux";
import { createReviewThunk, getAllSpotReviewsThunk } from "../../store/reviews";
import {useState} from 'react'
import { useModal } from "../../context/Modal";
import { getSpotThunk } from "../../store/spot"
// import { useEffect } from "react";
import './CreateReviewModal.css'
import { useHistory } from "react-router-dom";

function CreateReviewModal ({spotId}){
    const dispatch = useDispatch();
    const history = useHistory();
    const {closeModal}= useModal();
    const [review,setReview] = useState('');
    const [rating,setRating] = useState(0);
    const [errors, setErrors] = useState({})

    // console.log('spot id from prop:',typeof spotId,spotId);
    const STARS = [1,2,3,4,5]

    const handleSubmit= async (e)=>{

        const errObj={}
            if(review.length<10) errObj.review = "Please write at least 10 characters";
            e.preventDefault();
            console.log('rating from user',rating);
            const newReview =  await dispatch(createReviewThunk({review,stars:rating},Number(spotId)));
            
            // console.log('this is the created review', newReview);
            
            if(newReview){
                await dispatch(getSpotThunk(spotId))
                .then(dispatch(getAllSpotReviewsThunk(spotId)))
                .then(()=>closeModal());
            }else setErrors(errObj);

            history.push(`/spots/${spotId}`)
          
    }


    return(
        <div className="create-review-box">
            <h1 className="review-modal-title">How was your stay?</h1>
                {!!Object.values(errors).length && <p className="errors">{errors.message}</p>}
            <form className="review-form" onSubmit={handleSubmit}>
                <textarea 
                    className="review-modal-description" 
                    rows='5'
                    type='text'
                    placeholder="Leave your review here..."
                    value={review}
                    onChange={e=>setReview(e.target.value)}
                    ></textarea>
                    <div className="review-rating">
                        <div className="review-stars">
                         {STARS.map(numStars=>{
                            return (
                                <span className='star-row' id={numStars>rating?'filled':'empty'}
                                    onMouseEnter={()=> setRating(numStars)}
                                    onClick={()=> setRating(rating)}
                                    >
                                        {/* {console.log('this is the star rating',rating)} */}
                                        <i className='fa-solid fa-star clickable'></i>
                                </span>
                            )
                         })}
                         &nbsp;
                               
                        <span className="star-label">Stars</span>
                        </div>
                        

                    </div>
                    <br/>
                
                    <div className="submit-review-btn">
                    <button id='submit-review' disabled={review.length<10}>Submit Your Review</button>

                    </div>


            </form>

        </div>
    )
}

export default CreateReviewModal
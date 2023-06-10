import { useDispatch } from "react-redux";
import { createReviewThunk } from "../../store/reviews";
import {useState} from 'react'
import { useModal } from "../../context/Modal";
import { getSpotThunk } from "../../store/spot";

function CreateReviewModal ({spotId}){
    const dispatch = useDispatch();
    const {closeModal}= useModal();
    const [review,setReview] = useState('');
    const [rating,setRating] = useState(0);


    const handleSubmit= async (e)=>{
        e.preventDefault();
        dispatch(createReviewThunk({review,rating},spotId));
        dispatch(getSpotThunk(spotId));
        closeModal();
    }

    const onChange = (stars) =>{
        setRating(parseInt(stars))
    }


    return(
        <div className="create-review-box">
            <h1>How was your stay?</h1>
            <form className="review-form" onSubmit={handleSubmit}>
                <textarea 
                    className="review-description" 
                    type='text'
                    placeholder="Leave your review here."
                    value={review}
                    onChange={e=>setReview(e.target.value)}
                    ></textarea>
                    <div className="review-rating">
                        <div className="review-stars">

                        </div>
                    </div>


            </form>

        </div>
    )
}

export default CreateReviewModal
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk, getAllSpotReviewsThunk } from "../../store/reviews";
import { getSpotThunk } from "../../store/spot";
import { useEffect } from "react";

function DeleteReviewModal({ reviewId, spotId }) {
    const dispatch = useDispatch()
    const history = useHistory()
    const { closeModal } = useModal()

    // console.log('review id from prop',reviewId);
    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(deleteReviewThunk(reviewId))
        .then( dispatch(getAllSpotReviewsThunk(spotId)))
            .then(closeModal())
            .then(history.push(`/spots/${spotId}`))
    }


    return (
        <div>
            <h1>Confirm Delete</h1>
            <h3>Are you sure you want to delete this spot from listings?</h3>
            <form onSubmit={handleSubmit}>
                <button type='submit'>Yes (Delete) </button>
                <button onClick={closeModal}>No</button>
            </form>
        </div>
    )
}

export default DeleteReviewModal;
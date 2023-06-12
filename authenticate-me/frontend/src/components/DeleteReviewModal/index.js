import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { deleteReviewThunk, getAllSpotReviewsThunk } from "../../store/reviews";
import './DeleteReviewModal.css'

function DeleteReviewModal({ reviewId, spotId }) {
    const dispatch = useDispatch()
    const history = useHistory()
    const { closeModal } = useModal()

    // console.log('review id from prop',reviewId);
    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(deleteReviewThunk(reviewId))
            .then(dispatch(getAllSpotReviewsThunk(spotId)))
            .then(closeModal())
            .then(history.push(`/spots/${spotId}`))
    }


    return (
        <div id="delete-review-modal">
            <div id='delete-review-box'>
                <h1 className="delete-review-title">Confirm Delete</h1>
                <p className="delete-review-description">Are you sure you want to delete this review?</p>
                <form id='delete-review-modal-form' onSubmit={handleSubmit}>
                    <button id="yes-delete" type='submit'>Yes (Delete Review) </button>
                    <button id='no-delete' onClick={closeModal}>No (Keep Review)</button>
                </form>
            </div>
        </div>
    )
}

export default DeleteReviewModal;
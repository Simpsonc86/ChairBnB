// frontend/src/components/DeleteFormModal/index.js
import React from "react";
// import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteFormModal.css";
import { deleteSpotThunk } from "../../store/spot";
import { useHistory } from "react-router-dom";
import { getAllSpotReviewsThunk } from "../../store/reviews";
// import { useEffect } from "react";

function DeleteFormModal({spotId}) {
  const dispatch = useDispatch();
  const history = useHistory();
  const {closeModal}= useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(deleteSpotThunk(spotId))
    await dispatch(getAllSpotReviewsThunk(spotId))
    closeModal();
    await history.push(`/current`)
    
  };

  return(
    <div id='delete-review-box'>
        <h1 className="delete-review-title">Confirm Delete</h1>
        <p className="delete-review-description">Are you sure you want to delete this spot from listings?</p>
        <form id='delete-review-modal-form'onSubmit={handleSubmit}>
            <button id="yes-delete" type='submit'>Yes (Delete Spot) </button>
            <button id='no-delete' onClick={closeModal}>No (Keep Spot)</button>
        </form>
    </div>

  )
}

export default DeleteFormModal;
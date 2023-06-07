// frontend/src/components/DeleteFormModal/index.js
import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DeleteForm.css";
import { deleteSpotThunk } from "../../store/spot";

function DeleteFormModal() {
  const dispatch = useDispatch();
  const spot = useSelector(state=>{
    console.log(state.spot); 
    return state.spots.singleSpot
})
  

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    dispatch(deleteSpotThunk(spotId))
  };

  return(
    <>
        <h1>Confirm Delete</h1>
        <h3>Are you sure you want to delete this spot from listings?</h3>
        <form onSubmit={handleSubmit}>
            <button>Yes (Delete) </button>
            <button onClick={closeModal}>No</button>
        </form>
    </>

  )
}

export default DeleteFormModal;
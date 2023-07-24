/**
 * import useDispatch and useselector
 * import react
 * 
 * define component
 * 
 * get from the database api/spots/current
 * 
 * useeffect to dispatch thunk on mount
 */

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from 'react';
import './ManageSpots.css'
import { Link, useHistory } from 'react-router-dom';
import { getAllSpotsThunk } from '../../store/spot';

import DeleteFormModal from "../DeleteFormModal";
import OpenModalButton from "../OpenModalButton";



function ManageSpots() {
    const dispatch = useDispatch();
    const history = useHistory();
    const spots = useSelector(state => state.spots.allSpots);
    // console.log('This is all spots',spotsObj);
    const owner = useSelector(state => state.session.user)

    const userSpots = Object.values(spots).filter(ownedSpots => {
        // console.log('owned spots id------>', ownedSpots.ownerId)
        return ownedSpots.ownerId === owner.id;
    })
    console.log('This is all the owner`s spots', userSpots);

    useEffect(() => {
        dispatch(getAllSpotsThunk(spots.length));

    }, [dispatch, spots.length]);



    const noImg = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'
    return (
        <div className='manage-main-div'>
            <div className="manage-main-box">

                <h1 className="manage-spots-title">Manage Spots</h1>
                {userSpots.length === 0 ?
                    <div className="manage-create-spot">                    
                        <Link id='manage-create-spot-btn' to={`/spots/new`}>Create a New Spot</Link>                   
                    </div>
                    : null}
                <div className='manage-main-spots'>
                    <div className='manage-spot-tiles'>
                        {userSpots.reverse().map(oneSpot => (
                            // console.log(oneSpot),
                            <div key={oneSpot.id} className='manage-spot-div' >
                                <Link className='answer-from-rawaha-in-slack' to={`/spots/${oneSpot.id}`}>


                                {oneSpot.previewImage ? <img className='manage-spot-img' src={oneSpot.previewImage} alt='Preview' /> : <img src={noImg} alt='No Preview' />}
                                <div className='spot-tile-desc-top'>
                                    <span className='city-state'>{oneSpot.city}, {oneSpot.state}</span>
                                    <span className='rating'>
                                        <i className='fa-solid fa-star'></i>
                                        {oneSpot.avgRating ? oneSpot.avgRating : 'New'}
                                    </span>
                                </div>
                                <p className='price'>${Number(oneSpot.price).toFixed(2)} per night</p>
                                {/* {console.log('spot details: ',oneSpot)} */}
                                </Link>
                                <span className='manage-spot-btn-span'>

                                    <button id='post-review-btn'onClick={() => history.push(`/update-spot/${oneSpot.id}`)}>Update</button>
                                    &nbsp;&nbsp;
                                    <OpenModalButton id='update-btn' buttonText='Delete' modalComponent={<DeleteFormModal spotId={oneSpot.id} />} />
                                </span>

                            </div>
                        )
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageSpots;
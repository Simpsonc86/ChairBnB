import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { getAllSpotsThunk } from '../../store/spot';
// import SingleSpot from '../SingleSpot';
import { useHistory } from 'react-router-dom';


function AllSpots({ spot }) {
    const history = useHistory();
    const dispatch = useDispatch();
    // const sessionUser = useSelector(state => state.session.user);
    const spotsObj = useSelector(state => state.spots.spots);

    const handleClick = (spot) => {
        history.push(`/spots/${spot.id}`);
    }

    useEffect(() => {
        dispatch(getAllSpotsThunk());
    }, [dispatch]);

    if (!spotsObj) return null

    const allSpots = Object.values(spotsObj);
    // console.log('allSpots in component: ',allSpots);

    if (!allSpots.length) return null

    let noImg = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'

    return (
        <div className='main'>
            <div className='spot-tiles'>
                {allSpots.map(oneSpot => (
                    // console.log(oneSpot)
                    <div className='spot-link' key={oneSpot.id} >
                        <NavLink to={`/spots/${oneSpot.id}`} onClick={handleClick}>
                            {oneSpot.previewImage ? <img src={oneSpot.previewImage} alt='Preview' /> : <img src={noImg} alt='No Preview' />}
                            <p className='city-state'>{oneSpot.city}, {oneSpot.state}</p>
                            <p className='rating'>
                                <i className='fa-solid fa-star'></i>
                                {oneSpot.avgRating ? oneSpot.avgRating : 'No Reviews'}
                            </p>
                            <p className='price'>${Number(oneSpot.price).toFixed(2)} per night</p>
                            {/* {console.log('spot details: ',oneSpot)} */}
                        </NavLink>
                    </div>
                )
                )}
            </div>
        </div>
    )

}

export default AllSpots
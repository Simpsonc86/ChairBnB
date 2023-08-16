import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getAllSpotsThunk } from '../../store/spot';
// import SingleSpot from '../SingleSpot';
import { useHistory } from 'react-router-dom';
import './AllSpots.css'


function AllSpots() {
    const history = useHistory();
    const dispatch = useDispatch();
    // const sessionUser = useSelector(state => state.session.user);
    const spotsObj = useSelector(state => state.spots.allSpots);
    // console.log('This is all spots',spotsObj);

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

    const noImg = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'

    return (
        <div className='main-div'>
            <div className='main-spots'>
                <div className='spot-tiles'>
                    {allSpots.reverse().map(oneSpot => (
                        // console.log(oneSpot)
                        <Link to={`/spots/${oneSpot.id}`} key={oneSpot.id} onClick={handleClick} className='spot-link hover-text' >
                            <span className='tooltip-text'>{oneSpot.name}</span>

                            {oneSpot?.previewImage ? <img className='preview-img'src={oneSpot.previewImage} alt='Preview' /> : <img className='preview-img'src={noImg} alt='No Preview' />}
                            <div className='spot-tile-desc-top'>
                                <span className='city-state'>{oneSpot.city}, {oneSpot.state}</span>
                                <span className='rating'>
                                    <i className='fa-solid fa-star'></i>
                                    {oneSpot.avgRating ? oneSpot.avgRating.toFixed(2) : 'New'}
                                </span>
                            </div>
                            <p className='price'>${oneSpot.price} night</p>
                            {/* {console.log('spot details: ',oneSpot)} */}

                        </Link>
                    )
                    )}
                </div>
            </div>
        </div>
    )

}

export default AllSpots
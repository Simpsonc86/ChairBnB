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
    const spotsObj = useSelector(state => state.spots);

    const handleClick = () => {
        history.push(`/spots/${spot.id}`);
    }


    useEffect(() => {
        dispatch(getAllSpotsThunk());
    }, [dispatch]);

    if (!spotsObj) return null

    const allSpots = Object.values(spotsObj);
    // console.log('allSpots in component: ',allSpots);

    return (
        <div className='main'>
            <div className='spot-tiles'>
                {allSpots.map(oneSpot =>
                    // console.log(oneSpot)
                    <div className='spot-link' key={`${oneSpot.id}`} >
                        <NavLink to={`/spots/${oneSpot?.id}`} onClick={handleClick}>
                            {oneSpot?.name}
                        </NavLink>
                    </div>

                )}
            </div>
        </div>
    )

}

export default AllSpots
import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSpotThunk } from "../../store/spot";
import { useEffect } from "react";

const SingleSpot = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch();
    // const history = useHistory();

    const spot = useSelector(state => {
        console.log('state from the store', state);
        return state.spots.singleSpot
    });
    // console.log('spot from store ', spot);

    useEffect(() => {
        dispatch(getSpotThunk(spotId));
    }, [dispatch,spotId]);

    if(!spot.Owner)return <div>...On the Way! Have faith!...</div>

    return (
        <div>
            <div>
                <h1>{spot.name}</h1>
                <h3>{spot.city}, {spot.state}, {spot.country}</h3>
            </div>
            <div>
                {/* <img src={spot.SpotImages[0].url} alt='preview'/> */}
            </div>
            <div>
                {/* pictures grid here */}
            </div>
            <div>
                <h2>
                    Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
                </h2>
                <p>{spot.description}</p>
            </div>
            <div>
                <span>${spot.price} night</span>
                <span>  <i className='fa-solid fa-star'></i> {spot.avgStarRating}</span>
                <span> {spot.numReviews} {spot.numReviews<2?'review':'reviews'}</span>
            </div>
        </div>
    )
}

export default SingleSpot;
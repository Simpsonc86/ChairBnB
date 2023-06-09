import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSpotThunk } from "../../store/spot";
import { getAllSpotReviewsThunk } from "../../store/reviews";
import { useEffect } from "react";
import './SingleSpot.css'
import OpenModalButton from "../OpenModalButton";

const SingleSpot = () => {
    const { spotId } = useParams()
    const dispatch = useDispatch();
    // const history = useHistory();

    const spot = useSelector(state => {
        // console.log('state from the store', state);
        return state.spots.singleSpot
    });
    // console.log('spot from store ', spot);
    const reviews = useSelector(state => state.reviews.spot)
    console.log('reviews from spot ', reviews);


    useEffect(() => {
        dispatch(getSpotThunk(spotId));
        dispatch(getAllSpotReviewsThunk(spotId))
    }, [dispatch, spotId]);

    const reserveBtnClick = (e) => {
        e.preventDefault();
        alert('Feature Coming Soon!')
    }

    if (!spot.Owner) return <div>...On the Way! Have faith!...</div>

    return (
        <div className="spot-details-main">
            <div className='spot-details-box'>
                <div className="spot-heading">
                    <h1>{spot.name}</h1>
                    <h3>{spot.city}, {spot.state}, {spot.country}</h3>
                </div>
                <div className="images-box">
                    <div className="previmage-div">
                        <img className='spot-preview-img' src={spot.SpotImages[0].url} alt='preview' />
                    </div>
                    <div className="non-preview-spot-images-div">
                        <div className="top-row-images">
                            {spot.SpotImages[1] && <img className='spot-grid-img' src={spot.SpotImages[1].url} alt='spotImg1' />}
                            {spot.SpotImages[2] && <img className='spot-grid-img' src={spot.SpotImages[2].url} alt='spotImg2' />}
                        </div>
                        <div className="bottom-row-images">
                            {/* pictures grid here */}
                            {spot.SpotImages[3] && <img className='spot-grid-img' src={spot.SpotImages[3].url} alt='spotImg3' />}
                            {spot.SpotImages[4] && <img className='spot-grid-img' src={spot.SpotImages[4].url} alt='spotImg4' />}
                        </div>
                    </div>
                </div>
                <div className="spot-details-info">
                    <div>
                        <h2>
                            Hosted by {spot.Owner.firstName} {spot.Owner.lastName}
                        </h2>
                        <p>{spot.description}</p>
                    </div>
                    <div className="price-reviews-box">
                        <div className='price-reviews'>
                            <span>${spot.price} night</span>
                            <div className="c">
                                <span>
                                    <i className='fa-solid fa-star'></i>
                                    {spot.avgStarRating}
                                    {spot.avgStarRating ? <span>&nbsp;&#x2022;&nbsp;</span> : ''}
                                </span>
                                <span>
                                    {spot.numReviews === 0 ? 'New' : spot.numReviews}
                                    {spot.numReviews === 1 ? ' review' : ''}
                                    {spot.numReviews > 1 ? ' reviews' : ''}
                                </span>
                            </div>
                        </div>
                        <button className="reserve-btn" onClick={reserveBtnClick}>Reserve</button>
                    </div>
                </div>
            </div>
            <hr/>
            <div className="reviews-section-div">
                <span>
                    <i className='fa-solid fa-star'></i>
                    {spot.avgStarRating}
                    {spot.avgStarRating ? <span>&nbsp;&#x2022;&nbsp;</span> : ''}
                </span>
                <span>
                    {spot.numReviews === 0 ? 'New' : spot.numReviews}
                    {spot.numReviews === 1 ? ' review' : ''}
                    {spot.numReviews > 1 ? ' reviews' : ''}
                </span>
                <br/>
                <br/>
                
                <div className="post-review-btn">
                <OpenModalButton buttonText='Post Your Review'/>

                </div>

                {console.log('OBJECT VALUES', Object.values(reviews))}
                {reviews ? Object.values(reviews).map((review) => {
                    console.log('this is the review inside the map', review);
                    return <div key={review.id} className="review-data">
                        <p>{review.User.firstName}{review.User.lastName}</p>
                        <p>{review.createdAt}</p>
                        <p >{review.review}</p>
                        {/* {if(review.User.id===)} */}
                        <button>Delete</button>
                        </div>
                }) : null}
            </div>
        </div>
    )
}

export default SingleSpot;
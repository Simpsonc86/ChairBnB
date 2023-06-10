import { csrfFetch } from "./csrf";

// type strings
const GET_ALL_SPOT_REVIEWS = '/reviews/spotReviews';
// const GET_ALL_USER_REVIEWS = '/reviews/userReviews';
const CREATE_REVIEW = 'reviews/createReview'


//action creator
const getAllSpotReviews = (spot) => {
    return {
        type: GET_ALL_SPOT_REVIEWS,
        payload: spot
    }
}
// const getAllUserReviews = (user) => {
//     return {
//         type: GET_ALL_USER_REVIEWS,
//         payload: user
//     }
// }
const createReview = (review) => {
    return {
        type: CREATE_REVIEW,
        payload: review,
        
    }
}

//thunk action creators
export const getAllSpotReviewsThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if(res.ok){
        const data = await res.json();
        // console.log('reviews from the thunk ', data);
        dispatch(getAllSpotReviews(data))
    }
}

// export const getAllUserReviewsThunk = () =>async (dispatch)=>{
//     const res = await csrfFetch(`/api/reviews/current`)

//     if(res.ok){
//         const data = await res.json();
//         // console.log('reviews from the thunk ', data);
//         dispatch(getAllUserReviews(data))
//     }
// }

export const createReviewThunk = (review) => async (dispatch) => {

    // fetch from api
    try {
        const res = await csrfFetch(`/api/reviews/${review.spotId}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        });
        console.log('response from fetch', res);

        if (res.ok) {
            const createdReview = await res.json();

            await dispatch(createReview(createdReview))

            return createdReview;

        }
    } catch (err) {
        // console.log('this is the err from the catch',err);
        const errors = await err.json();
        return errors;
    }
}

//reducer

const initialState = { user:{}, spot:{}}

const reviewReducer = (state = initialState, action) =>{
    let newState;
    switch (action.type){
        case GET_ALL_SPOT_REVIEWS:{

            const spot = action.payload;
            // console.log('this is ...spot', {...spot});
            newState={user:{...state.user},spot:{}}
            if(spot.Reviews){
                spot.Reviews.forEach(review => {
                    newState.spot[review.id] = review;                                
                });
            }else{
                newState = {...spot}
            }
            return newState;
        }
        // case GET_ALL_USER_REVIEWS:{

        //     const user = action.payload;
        //     console.log('this is ...user', {...user});
        //     newState={user:{},spot:{...state.spot}}
        //     if(user.Reviews){
        //         user.Reviews.forEach(review => {
        //             newState.user[review.id] = review;                                
        //         });
        //     }else{
        //         newState = {...user}
        //     }
        //     return newState;
        // }
        case CREATE_REVIEW: {
            const review = action.payload
            newState = {user:{...state.user}, spot: {...state.spot} }
            newState.spot[review.id]=review
            console.log('create a review', newState);
            return newState;
        }
        default:
            return state;
    }
}

export default reviewReducer;

import { csrfFetch } from "./csrf";

//redux
//type string
const GET_ALL_SPOTS = 'spot/getAllSpots';
const GET_ONE_SPOT = 'spot/getSpot';
const CREATE_SPOT = 'spot/createSpot'
const GET_ALL_USERS_SPOTS = 'spot/manageSpots'

//action creator
const getAllSpots = (spots) => {
    // console.log(' all spots: ',spots);
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    }
}

const getSpot = (spot) => {
    return {
        type: GET_ONE_SPOT,
        payload: spot
    }
}

const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        payload: spot
    }
}

const getAllUserSpots = (spots) =>{
    return{
        type:GET_ALL_USERS_SPOTS,
        payload: spots
    }
}

////////////////thunk action creators
export const getAllSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const data = await res.json();
        // console.log(data);
        dispatch(getAllSpots(data));
        return data;
    }
}
///////////get one spot
export const getSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    if (res.ok) {
        const data = await res.json();
        // console.log('res data from thunk',data);
        dispatch(getSpot(data));
        return data;
    }
}
///create a spot
export const createSpotThunk = (spot, images, owner) => async (dispatch) => {

    // fetch from api
    try {
        const res = await csrfFetch(`/api/spots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(spot)
        });
        console.log('response from fetch', res);

        if (res.ok) {
            const createdSpot = await res.json();
            //iterate through spot images and use spot id to hit backend enpoint for images
            // /api/spot/${createdSpot.id}/images
            // use a for let of loop to iterate thru images
            // console.log('this is the created spot from the thunk number 1', createdSpot);
            // console.log('this is the created spot id', createdSpot.id);
            let spotImages = [];
            for (let image of images) {
                
                image.spotId = createdSpot.id
                
                // console.log('this is the created spot id inside loop', createdSpot.id);
                // console.log('this is the current image from loop', image);
                const imgRes = await csrfFetch(`/api/spots/${createdSpot.id}/images`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(image)

                })
                
                if (imgRes.ok) {
                    const createdImg = await imgRes.json();
                    spotImages.push(createdImg)
                }
            }
            
            createdSpot.SpotImages = spotImages;
            createdSpot.Owner = owner;
            
            // console.log('this is the created spot from the thunk number 2', createdSpot);
            await dispatch(createSpot(createdSpot))
            // console.log('this is the created spot from the thunk number 3', createdSpot);
            return createdSpot;

        }
    } catch (err) {
        // console.log('this is the err from the catch',err);
        const errors = await err.json();
        return errors;
    }
}
/// curent user spots
export const getAllUserSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/current');

    if (res.ok) {
        const data = await res.json();
        console.log('this is the returned data from the thunk',data);
        dispatch(getAllUserSpots(data));
        return data;
    }
}
//reducer: case in the reducer for all spots

const initialState = { allSpots: {}, singleSpot: {} }

const spotReducer = (state = initialState, action) => {
    let newState;
    console.log('action from spotReducer', action);
    switch (action.type) {
        case GET_ALL_SPOTS: {
            //normalize spot data
            newState = {...state, allSpots: {}, singleSpot: {} }
            console.log('allspots',action.payload.Spots);
            action.payload.Spots.forEach(spot => {
                newState.allSpots[spot.id] = spot
            });

            // console.log('newState :',newState);
            return newState;
        }
        case GET_ONE_SPOT: {
            const spot = action.payload
            newState = {...state, allSpots: {}, singleSpot: { ...spot } }
            newState.singleSpot[spot.id] = spot
            
            console.log('get one spot', newState);
            return newState;
        }
        case CREATE_SPOT: {
            const spot = action.payload
            newState = {...state, allSpots: {}, singleSpot: {...spot} }
            newState.singleSpot[spot.id]=spot
            console.log('create a spot', newState);
            return newState;
        }
        case GET_ALL_USERS_SPOTS:{
            newState = {...state, allSpots: {}, singleSpot: {} }
            console.log('allspots from user',action.payload.Spots);
            action.payload.Spots.forEach(spot => {
                newState.allSpots[spot.id] = spot
            });
            
            console.log('newState from:',newState);
            return newState;
        }
        default: {
            return state;
        }
    }
}

export default spotReducer;


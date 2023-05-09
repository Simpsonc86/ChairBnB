import { csrfFetch } from "./csrf";

//redux
//type string
const GET_ALL_SPOTS = 'spot/getAllSpots';
const GET_ONE_SPOT = 'spot/getSpot';

//action creator
const getAllSpots = (spots) =>{
    // console.log(' all spots: ',spots);
    return {
        type: GET_ALL_SPOTS,
        payload: spots
    }
}

const getSpot = (spot) =>{
    return {
        type: GET_ONE_SPOT,
        payload: spot
    }
}
//thunk action creator
export const getAllSpotsThunk= () => async (dispatch) =>{
    const res = await csrfFetch('/api/spots');

    if(res.ok){
        const data = await res.json();
        // console.log(data);
        dispatch(getAllSpots(data));
        return data;
    }
}

export const getSpotThunk = (spotId) => async (dispatch) =>{
    const res = await csrfFetch(`/api/spots/${spotId}`);
    if(res.ok){
        const data = await res.json();
        // console.log(data);
        dispatch(getSpot(data));
        return data;
    }
}
//reducer: case in the reducer for all spots

const initialState = {spots:{}, oneSpot:{}}


const spotReducer = (state = initialState, action) => {
    let newState;
    switch(action.type){
        case GET_ALL_SPOTS:{
            //normalize spot data
            newState = {spots:{}, oneSpot:{}}
            // console.log('-----',action.payload.Spots);
                action.payload.Spots.forEach(spot => {
                    newState.spots[spot.id] = spot
                });
        
            // console.log('newState :',newState);
            return newState;
        }
        case GET_ONE_SPOT:{
            const spot = action.payload.spot
            newState = {spots:{}, oneSpot:{...spot}}
            // newState.oneSpot= spot;
            console.log('newState----',newState);
            return newState;
        }
        default:{
            return state;
        }
    }
}

export default spotReducer;


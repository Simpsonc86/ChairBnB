import { csrfFetch } from "./csrf";

//redux
//type string
const GET_ALL_SPOTS = 'spot/getAllSpots';
const GET_ONE_SPOT = 'spot/getSpot';
const CREATE_SPOT = 'spot/createSpot'

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
//thunk action creator
export const getAllSpotsThunk = () => async (dispatch) => {
    const res = await csrfFetch('/api/spots');

    if (res.ok) {
        const data = await res.json();
        // console.log(data);
        dispatch(getAllSpots(data));
        return data;
    }
}

export const getSpotThunk = (spotId) => async (dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}`);
    if (res.ok) {
        const data = await res.json();
        // console.log('res data from thunk',data);
        dispatch(getSpot(data));
        return data;
    }
}

export const createSpotThunk = (spot) => async (dispatch)=>{
    const{
        ownerId, 
        name,
        address, 
        city, 
        state, 
        country,
        lat,
        lng,
        description,
        price,
        spotImages // this needs to be looped through because it is an array of images
        } = spot;

    const newSpot = {
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    };
    // fetch from api
    const res = await csrfFetch(`/api/spots`, {
        method:'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(newSpot)
    });

    if(res.ok){

        const newSpot = await res.json();


        dispatch(createSpot(newSpot))
    }
}
//reducer: case in the reducer for all spots

const initialState = { spots: {}, oneSpot: {} }


const spotReducer = (state = initialState, action) => {
    let newState;
    console.log('action from spotReducer', action);
    switch (action.type) {
        case GET_ALL_SPOTS: {
            //normalize spot data
            newState = { spots: {}, oneSpot: {} }
            // console.log('allspots',action.payload.Spots);
            action.payload.Spots.forEach(spot => {
                newState.spots[spot.id] = spot
            });

            // console.log('newState :',newState);
            return newState;
        }
        case GET_ONE_SPOT: {
            const spot = action.payload
            newState = { spots: {}, oneSpot: { ...spot } }
            // newState.oneSpot= spot;
            console.log('get one spot', newState);
            return newState;
        }
        case CREATE_SPOT:{
            const spot = action.payload
            newState = { spots:{},oneSpot:{...spot}}
            console.log('create a spot',newState);
        }
        default: {
            return state;
        }
    }
}

export default spotReducer;


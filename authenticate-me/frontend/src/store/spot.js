import { csrfFetch } from "./csrf";

//redux
//type string
const GET_ALL_SPOTS = 'spot/getAllSpots';

//action creator
const getAllSpots = (spots) =>{
    // console.log(' all spots: ',spots);
    return {
        type: GET_ALL_SPOTS,
        payload: spots
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
//reducer: case in the reducer for all spots

const initialState = {spots:null, oneSpot:null}


const spotReducer = (state = initialState, action) => {
    let newState;
    switch(action.type){
        case GET_ALL_SPOTS:{
            //normalize spot data
            newState = Object.assign({},state.spots)
            // console.log('-----',action.payload.Spots);
                action.payload.Spots.forEach(spot => {
                    newState[spot.id] = spot
                });
        
            // console.log('newState :',newState);
            return newState;
        }
        default:{
            return state;
        }
    }
}

export default spotReducer;


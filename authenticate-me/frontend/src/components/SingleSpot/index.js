import { useDispatch } from "react-redux"
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getSpotThunk } from "../../store/spot";
import { useEffect } from "react";

const SingleSpot= ()=>{
    const {spotId}= useParams()
    const dispatch = useDispatch();
      
    const spot = useSelector(state => state.spots.spots[spotId]);
    console.log('spot from store ',spot);

    useEffect(()=>{
        dispatch(getSpotThunk(spotId));
    },[dispatch,spotId]);
      
    return(
       <div>
        {/* <h1>{spot.name}</h1> */}
       </div>
    )
}

export default SingleSpot;
/**
 * import useDispatch and useselector
 * import react
 * 
 * define component
 * 
 * get from the database api/spots/current
 * 
 * useeffect to dispatch thunk on mount
 */

// import { useDispatch,useSelector } from "react-redux";
import './ManageSpots.css'
import { useHistory } from 'react-router-dom';

function ManageSpots(){
const history = useHistory()

const handleClick = (spot)=>{
    history.push(`/`)
}

    return(
        <h1>Manage Spots</h1>
    )
}

export default ManageSpots;
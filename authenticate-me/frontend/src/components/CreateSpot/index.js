import { useDispatch,useSelector} from "react-redux";
import { createSpotThunk } from "../../store/spot";
import { getAllSpotsThunk } from "../../store/spot";
import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
import {useModal} from '../../context/Modal';

function CreateSpot(){
    const history = useHistory()
    const dispatch = useDispatch()

    //states
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [description,setDescription] = useState('');
    const [city,setCity] = useState('');
    const [country,setCountry] = useState('');
    const [state,setState] = useState('');
    const [price,setPrice] = useState('');
    const [previewImage,setPreviewImage] = useState('');
    const [image1,setImage1] = useState('');
    const [image2,setImage2] = useState('');
    const [image3,setImage3] = useState('');
    const [image4,setImage4] = useState('');
    const [errors,setErrors] = useState({});
    const {closeModal} = useModal();

    //check if user is logged in
    const user = useSelector(state =>{
        console.log(state.session.user);
        return state.session.user
    })

    //useeffects
    

    return(
        <div>Create a spot</div>
    )
}

export default CreateSpot;
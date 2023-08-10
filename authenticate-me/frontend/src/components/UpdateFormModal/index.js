import { useDispatch, useSelector } from "react-redux";
import { getSpotThunk,updateSpotThunk} from "../../store/spot";
import { useHistory, useParams } from "react-router-dom";
import { useState } from "react";
import './UpdateFormModal.css'
import { useModal } from '../../context/Modal';
import { useEffect } from "react";


function UpdateFormModal() {
    const history = useHistory()
    const dispatch = useDispatch()
    const {closeModal}= useModal();
    const {spotId} = useParams()

    // console.log(typeof spotId);
    const spotNum = Number(spotId)
    // console.log('spot num', spotNum);


    const owner = useSelector(state => {
        // console.log('state from the store', state);
        return state.session.user
    });
    // const spot = useSelector(state=>state.singleSpot);

    //states
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState({});

    /////////
    /**
     *
     * use effect
     * get spot thunk
     * use id from use params
     * .then(data=>clg(data))
     * populate state setters
     * on mount
     */
    useEffect(()=>{
        dispatch(getSpotThunk(spotNum)).then(data=>{
            setName(data.name)
            setAddress(data.address)
            setDescription(data.description)
            setCity(data.city)
            setCountry(data.country)
            setState(data.state)
            setPrice(data.price)
        })
        // console.log('this is the data from the get spot thunk------',data);
    },[dispatch,spotNum])

    // validations for controlled inputs
 
    const handleSubmit = async (e) => {
        e.preventDefault();
                
        const errObj = {};
        if (!name.length) errObj.name = "Title is required"
        if (!address.length) errObj.address = "Address is required"
        if (!description.length || description.length < 30) errObj.description = "Description needs a minimum of 30 characters"
        if (!city.length) errObj.city = "City is required"
        if (!country.length) errObj.country = "Country is required"
        if (!state.length) errObj.state = "State is required"
        if (isNaN(price) || Number(price) < 1) errObj.price = "Price is required"        
                    
        if (!Object.values(errObj).length) {
          
            //Thunk args = (spot,owner)
            const updatedSpot = await dispatch(updateSpotThunk({
                id:spotNum,
                name,
                address,
                description,
                city,
                country,
                lat: 0,
                lng: 0,
                state,
                price,
            }, owner))

            // console.log('This is the updated spot from the component',  updatedSpot);
            

            // console.log('This is the spot owner', owner);
            // console.log(!Object.values(errors).length);

            if(updatedSpot){
                closeModal()
                history.push(`/spots/${updatedSpot.id}`)
                
            }            
        }else setErrors(errObj)

    }
    
    const STATES = [
        { name: 'Not in the USA', abbreviation: 'NA'},
        { name: 'Alabama', abbreviation: 'AL' },
        { name: 'Alaska', abbreviation: 'AK' },
        { name: 'Arizona', abbreviation: 'AZ' },
        { name: 'Arkansas', abbreviation: 'AR' },
        { name: 'California', abbreviation: 'CA' },
        { name: 'Colorado', abbreviation: 'CO' },
        { name: 'Connecticut', abbreviation: 'CT' },
        { name: 'Delaware', abbreviation: 'DE' },
        { name: 'Florida', abbreviation: 'FL' },
        { name: 'Georgia', abbreviation: 'GA' },
        { name: 'Hawaii', abbreviation: 'HI' },
        { name: 'Idaho', abbreviation: 'ID' },
        { name: 'Illinois', abbreviation: 'IL' },
        { name: 'Indiana', abbreviation: 'IN' },
        { name: 'Iowa', abbreviation: 'IA' },
        { name: 'Kansas', abbreviation: 'KS' },
        { name: 'Kentucky', abbreviation: 'KY' },
        { name: 'Louisiana', abbreviation: 'LA' },
        { name: 'Maine', abbreviation: 'ME' },
        { name: 'Maryland', abbreviation: 'MD' },
        { name: 'Massachusetts', abbreviation: 'MA' },
        { name: 'Michigan', abbreviation: 'MI' },
        { name: 'Minnesota', abbreviation: 'MN' },
        { name: 'Mississippi', abbreviation: 'MS' },
        { name: 'Missouri', abbreviation: 'MO' },
        { name: 'Montana', abbreviation: 'MT' },
        { name: 'Nebraska', abbreviation: 'NE' },
        { name: 'Nevada', abbreviation: 'NV' },
        { name: 'New Hampshire', abbreviation: 'NH' },
        { name: 'New Jersey', abbreviation: 'NJ' },
        { name: 'New Mexico', abbreviation: 'NM' },
        { name: 'New York', abbreviation: 'NY' },
        { name: 'North Carolina', abbreviation: 'NC' },
        { name: 'North Dakota', abbreviation: 'ND' },
        { name: 'Ohio', abbreviation: 'OH' },
        { name: 'Oklahoma', abbreviation: 'OK' },
        { name: 'Oregon', abbreviation: 'OR' },
        { name: 'Pennsylvania', abbreviation: 'PA' },
        { name: 'Rhode Island', abbreviation: 'RI' },
        { name: 'South Carolina', abbreviation: 'SC' },
        { name: 'South Dakota', abbreviation: 'SD' },
        { name: 'Tennessee', abbreviation: 'TN' },
        { name: 'Texas', abbreviation: 'TX' },
        { name: 'Utah', abbreviation: 'UT' },
        { name: 'Vermont', abbreviation: 'VT' },
        { name: 'Virginia', abbreviation: 'VA' },
        { name: 'Washington', abbreviation: 'WA' },
        { name: 'West Virginia', abbreviation: 'WV' },
        { name: 'Wisconsin', abbreviation: 'WI' },
        { name: 'Wyoming', abbreviation: 'WY' },
    ];
    //if user adds bad data and thunk returns errors set errors object to those errors and display in jsx


    //call thunk and save response to variable check the created spot for errors
    //if errors display them else redirect to spot details
    // when submitted, reset the errors and validate again


    return (
        <div className="form-div">
            <form className='update-form-modal'onSubmit={handleSubmit}>
                <h1>Update Your Spot</h1>
                <h2>Where's your place located?</h2>
                <h3>Guest will only get your exact address once they booked a reservation</h3>
                <label>
                    Country
                    {errors.country && !country.length>0 && <span className="errors">&nbsp;{errors.country}</span>}
                    <br />
                    <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Country"
                    // required
                    />
                </label>
                <br />
                <label>
                    Street Address
                    {errors.address && !address.length>0 &&<span className="errors">&nbsp;{errors.address}</span>}
                    <br />
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                    // required
                    />
                </label>
                <br />
                <div className="city-state-form-div">
                    <label className="city-label">
                        City
                        {errors.city && !city.length>0 &&<span className="errors">&nbsp;{errors.city}</span>}
                        <br />
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                        // required
                        />
                    </label>
                    <span className="comma">,</span>
                    &nbsp;
                    <label className="state-label">
                        State
                        {errors.state && !state.length>0 &&<span className="errors">&nbsp;{errors.state}</span>}
                        <br />
                        <select
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="State"
                        // required
                        >
                            <option value="">Select a state from the dropdown</option>
                            {STATES.map((state)=>(
                                <option key={state.name} value={state.abbreviation}>{state.name}</option>
                            ))}
                        </select>
                        {/* {console.log('this is the selected state from the dropdown',state)} */}
                    </label>

                </div>
                <hr />
                <h2>Describe your place to guests</h2>
                <h3>
                    Mention the best features of your space, any special amentities like  fast wifi or paraking, and what you love about the neighborhood.
                </h3>
                <label>
                    <textarea
                        className="create-spot-textarea"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please write at least 30 characters"
                    // required
                    />
                    {errors.description && description.length<29 &&<p className="errors">{errors.description}</p>}
                </label>
                <hr />
                <h2>Create a title for your spot</h2>
                <h3>
                    Catch guests' attention with a spot title that highlights what makes your place special.
                </h3>
                <label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name of your spot"
                    // required
                    />
                    {errors.name && !name.length>0 &&<p className="errors">{errors.name}</p>}
                </label>
                <hr />
                <h2>Set a base price for your spot</h2>
                <h3>
                    Competitive pricing can help your listing stand out and rank higher in the search results
                </h3>
                <label>
                    <input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price per night (USD)"
                    // required
                    />
                    {errors.price && !price.length>0 &&<p className="errors">{errors.price}</p>}
                </label>               
                <hr />
                <button type='submit'>Update Spot</button>
            </form>
        </div>

    )
}

export default UpdateFormModal;

//disabled={!!Object.values(errors).length}
import { useDispatch, useSelector } from "react-redux";
import { createSpotThunk } from "../../store/spot";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import './CreateSpot.css'
// import { useModal } from '../../context/Modal';

function CreateSpot() {
    const history = useHistory()
    const dispatch = useDispatch()
    const owner = useSelector(state => {
        // console.log('state from the store', state);
        return state.session.user
    });

    //states
    const [name, setname] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [price, setPrice] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [image1, setImage1] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [image4, setImage4] = useState('');
    const [errors, setErrors] = useState({});
    // const [errObj, setErrObj] = useState({});

    // validations for controlled inputs

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errObj = {};
        if (name.length<3) errObj.name = "Title is required"
        if (address.length<6) errObj.address = "Address is required"
        if ((description.length>5000) || description.length < 30) errObj.description = "Description needs a minimum of 30 characters and less than 5000"
        if (city.length<2) errObj.city = "City is required"
        if (country.length<2) errObj.country = "Country is required"
        if (state.length<2) errObj.state = "State is required"
        if (isNaN(Number(price)) || Number(price) < 1 || Number(price) >10000) errObj.price = "Price is required less than $10000"
        if (previewImage.length<5 ) errObj.previewImage = "Preview image is required"
        if (previewImage && !previewImage.endsWith('.png') && !previewImage.endsWith('.jpg') && !previewImage.endsWith('.jpeg')) errObj.previewImage2 = "Preview image must end in .png, .jpg, or .jpeg"
        if (image1 && !image1.endsWith('.png') && !image1.endsWith('.jpg') && !image1.endsWith('.jpeg')) errObj.image1 = "Image URL must end in .png, .jpg, or .jpeg"
        if (image2 && !image2.endsWith('.png') && !image2.endsWith('.jpg') && !image2.endsWith('.jpeg')) errObj.image2 = "Image URL must end in .png, .jpg, or .jpeg"
        if (image3 && !image3.endsWith('.png') && !image3.endsWith('.jpg') && !image3.endsWith('.jpeg')) errObj.image3 = "Image URL must end in .png, .jpg, or .jpeg"
        if (image4 && !image4.endsWith('.png') && !image4.endsWith('.jpg') && !image4.endsWith('.jpeg')) errObj.image4 = "Image URL must end in .png, .jpg, or .jpeg"

        if (!Object.values(errObj).length) {
            // create an array for images for thunk arg if there are no errors in errObj
            let imgArr = [];

            imgArr.push({ url: previewImage, preview: true })
            if (image1) imgArr.push({ url: image1, preview: false })
            if (image2) imgArr.push({ url: image2, preview: false })
            if (image3) imgArr.push({ url: image3, preview: false })
            if (image4) imgArr.push({ url: image4, preview: false })

            console.log('this is the img Arr ', imgArr);
            //Thunk args = (spot,images,owner)
            const createdSpot = await dispatch(createSpotThunk({
                name,
                address,
                description,
                city,
                country,
                lat: 0,
                lng: 0,
                state,
                price,
            }, imgArr, owner))

            console.log('This is the created spot from the component', createdSpot);


            // console.log('This is the spot owner', owner);
            console.log(!Object.values(errObj).length);

            if (createdSpot) history.push(`/spots/${createdSpot.id}`)
        } else setErrors(errObj)

    }

    const STATES = [
        { name: 'Not in the USA', abbreviation: 'NA' },
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
            <form id='create-spot-form' onSubmit={handleSubmit}>
                <h1>Create a New Spot</h1>
                <h2>Where's your place located?</h2>
                <h3>Guest will only get your exact address once they booked a reservation</h3>
                <label>
                    Country
                    {errors.country && !country.length > 0 && <span className="errors">&nbsp;{errors.country}</span>}
                    <br />
                    <input
                        className="create-form-input"
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
                    {errors.address && !address.length > 0 && <span className="errors">&nbsp;{errors.address}</span>}
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
                        {errors.city && !city.length > 0 && <span className="errors">&nbsp;{errors.city}</span>}
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
                        {errors.state && !state.length > 0 && <span className="errors">&nbsp;{errors.state}</span>}
                        <br />
                        <select
                            className="state-select"
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="State"
                        // required
                        >
                            <option value="">Select a state from the dropdown</option>
                            {STATES.map((state) => (
                                <option key={state.name} value={state.abbreviation}>{state.name}</option>
                            ))}
                        </select>
                        {/* {console.log('this is the selected state from the dropdown', state)} */}
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
                    {errors.description && description.length < 30 && <p className="errors">{errors.description}</p>}
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
                        onChange={(e) => setname(e.target.value)}
                        placeholder="Name of your spot"
                    // required
                    />
                    {errors.name && !name.length > 0 && <p className="errors">{errors.name}</p>}
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
                    {errors.price && !price.length > 0 && <p className="errors">{errors.price}</p>}
                </label>
                <hr />
                <h2>Liven up your spot with photos</h2>
                <h3>
                    Submit a link to at least one photo to publish your spot.
                </h3>
                <label>
                    <input
                        type="text"
                        value={previewImage}
                        onChange={(e) => setPreviewImage(e.target.value)}
                        placeholder="Preview Image URL"
                    // required
                    />
                    {errors.previewImage && !previewImage.length > 0  && <p className="errors">{errors.previewImage}</p>}
                    {errors.previewImage2 && <p className="errors">{errors.previewImage2}</p>}
                </label>
                <br />
                <label>
                    <input
                        type="text"
                        value={image1}
                        onChange={(e) => setImage1(e.target.value)}
                        placeholder="Image URL"
                    // required
                    />
                    {errors.image1 && !image1.length > 0 && <p className="errors">{errors.image1}</p>}
                </label>
                <br />
                <label>
                    <input
                        type="text"
                        value={image2}
                        onChange={(e) => setImage2(e.target.value)}
                        placeholder="Image URL"
                    // required
                    />
                    {errors.image2 && !image2.length > 0 && <p className="errors" >{errors.image2}</p>}
                </label>
                <br />
                <label>
                    <input
                        type="text"
                        value={image3}
                        onChange={(e) => setImage3(e.target.value)}
                        placeholder="Image URL"
                    // required
                    />
                    {errors.image3 && !image3.length > 0 && <p className="errors">{errors.image3}</p>}
                </label>
                <br />
                <label>
                    <input
                        type="text"
                        value={image4}
                        onChange={(e) => setImage4(e.target.value)}
                        placeholder="Image URL"
                    // required
                    />
                    {errors.image4 && !image4.length > 0 && <p className="errors">{errors.image4}</p>}
                </label>
                <hr />
                <div className="create-btn-div">

                    <button 
                    className={'signup-btn'}
                        type="submit"
                        // disabled={!!Object.values(errors).length}
                        >Create Spot</button>
                </div>
            </form>
        </div>

    )
}

export default CreateSpot;

//disabled={!!Object.values(errors).length}
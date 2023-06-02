import { useDispatch, useSelector } from "react-redux";
import { createSpotThunk } from "../../store/spot";
import { getAllSpotsThunk } from "../../store/spot";
// import { useHistory } from "react-router-dom";
import { useState, useEffect } from "react";
// import { useModal } from '../../context/Modal';

function CreateSpot() {
    // const history = useHistory()
    const dispatch = useDispatch()

    //states
    const [title, setTitle] = useState('');
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
    // const { closeModal } = useModal();

    // validations for controlled inputs
    useEffect(() => {
        const errObj = {};
        if (!title.length) errObj.title = "Name is required"
        if (!address.length) errObj.address = "Address is required"
        if (!description.length || description.length < 30) errObj.description = "Description needs a minimum of 30 characters"
        if (!city.length) errObj.city = "City is required"
        if (!country.length) errObj.country = "Country is required"
        if (!state.length) errObj.state = "State is required"
        if (isNaN(price) || Number(price) < 0) errObj.price = "Price is required"
        if (!previewImage || (!previewImage.endsWith('.png') && !previewImage.endsWith('.jpg') && !previewImage.endsWith('.jpeg'))) errObj.previewImage = "Preview image is required"
        if (image1 && !image1.endsWith('.png') && !image1.endsWith('.jpg') && !image1.endsWith('.jpeg')) errObj.image1 = "Image URL must end in .png, .jpg, or .jpeg"
        if (image2 && !image2.endsWith('.png') && !image2.endsWith('.jpg') && !image2.endsWith('.jpeg')) errObj.image2 = "Image URL must end in .png, .jpg, or .jpeg"
        if (image3 && !image3.endsWith('.png') && !image3.endsWith('.jpg') && !image3.endsWith('.jpeg')) errObj.image3 = "Image URL must end in .png, .jpg, or .jpeg"
        if (image4 && !image4.endsWith('.png') && !image4.endsWith('.jpg') && !image4.endsWith('.jpeg')) errObj.image4 = "Image URL must end in .png, .jpg, or .jpeg"
        setErrors(errObj)
    }, [title, address, description, city, country, state, price, previewImage, image1, image2, image3, image4])

    //if user adds bad data and thunk returns errors set errors object to those errors and display in jsx
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!errors) {
            setErrors({});
            return dispatch(
                createSpotThunk({
                    title,
                    address,
                    description,
                    city,
                    country,
                    state,
                    price,
                    previewImage,
                    image1,
                    image2,
                    image3,
                    image4,
                })
            )
        }
        return setErrors({

        })
    }

    //call thunk and save response to variable check the created spot for errors
    //if errors display them else redirect to spot details
    // when submitted, reset the errors and validate again


    return (
        <form onSubmit={handleSubmit}>
            <h1>Create a new Spot</h1>
            <h2>Where's your place located?</h2>
            <h3>Guest will only get your exact address once they booked a reservation</h3>
            <label>
                Country
                {errors.country && <span>&nbsp;{errors.country}</span>}
                <br/>
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
                {errors.address && <span>&nbsp;{errors.address}</span>}
                <br/>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                // required
                />
            </label>
            <br />
            <label>
                City
                {errors.city && <span>&nbsp;{errors.city}</span>}
                <br/>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                // required
                />
            </label>
            <label>
                , State
                {errors.state && <span>&nbsp;{errors.state}</span>}
                <br/>
                <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                // required
                />
            </label>
            <hr />
            <h2>Describe your place to guests</h2>
            <h3>
                Mention the best features of your space, any special amentities like  fast wifi or paraking, and what you love about the neighborhood.
            </h3>
            <label>
                <textarea
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                // required
                />
                {errors.description && <p>{errors.description}</p>}
            </label>
            <hr />
            <h2>Create a title for your spot</h2>
            <h3>
                Catch guests' attention with a spot title that highlights what makes your place special.
            </h3>
            <label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Name of your spot"
                // required
                />
                {errors.title && <p>{errors.title}</p>}
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
                {errors.price && <p>{errors.price}</p>}
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
                {errors.previewImage && <p>{errors.previewImage}</p>}
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
                {errors.image1 && <p>{errors.image1}</p>}
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
                {errors.image2 && <p>{errors.image2}</p>}
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
                {errors.image3 && <p>{errors.image3}</p>}
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
                {errors.image4 && <p>{errors.image4}</p>}
            </label>
            <hr />
            <button type='submit' disabled={!!Object.values(errors).length}>Create Spot</button>
        </form>
    )
}

export default CreateSpot;
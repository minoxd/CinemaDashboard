import React, {useState} from "react";
import apiClient from "../../../api/apiClient";



const LmaoTest = () => {
    const [imageUri, setImageUri] = useState("");
    const [imageBackgroundUri, setImageBackgroundUri] = useState("");
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log(reader.result);
                setImageUri(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
    const handleImageBackgroundChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                console.log(reader.result);
                setImageBackgroundUri(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }
    const handleSubmit = async () => {
        const data = {
            name: 'Tenet',
            description: '',
            length: 200,
            imageBase64: imageUri,
            backgroundImageBase64: imageBackgroundUri,
            publishDate: '2020-08-26T00:00:00Z',
            trailerUrl: '',
            ratingId: 1,
            status: 1,
        }
        const response = await apiClient.put(
            `/admin/movie/4`,
            data
        )
        console.log(response)
    }
    return (
        <div>
            <input type="file" accept="image/*" onChange={handleImageChange}/>
            <input type="file" accept="image/*" onChange={handleImageBackgroundChange}/>
            <button onClick={handleSubmit}>Upload</button>
            {imageUri && <img src={imageUri} alt="Preview" style={{width: 200}}/>}
            {imageBackgroundUri && <img src={imageBackgroundUri} alt="Preview" style={{width: 200}}/>}
        </div>
    );
}

export default LmaoTest;
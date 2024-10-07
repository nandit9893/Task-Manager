import React, { useContext, useEffect, useState } from "react";
import "./UserData.css";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import background from "../../assets/background.jpg";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserData = () => {
  const { userID } = useParams();
  const navigate = useNavigate();
  const [ edit, setEdit ] = useState(false);
  const { url } = useContext(AppContext);
  const [ userSpecificData, setUserSpecificData ] = useState({});
  const [ image, setImage ] = useState(null);
  const [ formData, setFormData ] = useState({
    email: "",
    phone: "",
    address: "",
    company: "",
    website: "",
    image: ""
  });

  useEffect(() => {
    gettingSpecificUserData(userID);
  }, [userID]);

  const gettingSpecificUserData = async (userID) => {
    const newURL = `${url}/user/management/getting/specific/user/data/${userID}`;
    try {
      const response = await axios.get(newURL);
      if(response.data.success) {
        setUserSpecificData(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch the user.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred. Please try again.");
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error in setting up the request. Please try again.");
      }
    }
  }

  const navigateToHome = () => {
    navigate("/");
  };

  const handleEdit = () => {
    setEdit((prev) => !prev);
    setFormData({
      email: userSpecificData.email,
      phone: userSpecificData.phone,
      address: userSpecificData.address,
      company: userSpecificData.company,
      website: extractDomain(userSpecificData.website),
    });
  };

  function extractDomain(url) {
    try {
      const { hostname } = new URL(url);
      return hostname;
    } catch (error) {
      return null;
    }
  };

  const addProtocolToURL = (url) => {
    try {
      const normalizedURL = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
      return normalizedURL;
    } catch (error) {
      return url;
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const imageHandler = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSaveUserData = async (event) => {
    event.preventDefault();
    const formattedWebsite = addProtocolToURL(formData.website);
    const newFormData = new FormData();
    if (formData.email !== userSpecificData.email) {
      newFormData.append("email", formData.email);
    }
    if (formData.phone !== userSpecificData.phone) {
      newFormData.append("phone", formData.phone);
    }
    if (formData.address !== userSpecificData.address) {
      newFormData.append("address", formData.address);
    }
    if (formData.company !== userSpecificData.company) {
      newFormData.append("company", formData.company);
    }
    if (formattedWebsite !== userSpecificData.website) {
      newFormData.append("website", formattedWebsite);
    }
    if (image) {
      newFormData.append("avatar", image);
    }
    const newURL = `${url}/user/management/edit/user/details/${userID}`;
    try {
      const response = await axios.put(newURL, newFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if(response.data.success) {
        console.log(response.data.data)
        toast.success(`${userID.toUpperCase()} updated successfully`);
        setUserSpecificData(response.data.data); 
        setEdit(false); 
      } else {
        toast.error(response.data.message || "Error occurred while saving user data.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "An error occurred. Please try again.");
      } else if (error.request) {
        toast.error("No response from server. Please try again.");
      } else {
        toast.error("Error in setting up the request. Please try again.");
      }
    }
  };

  return (
    <div className="userdata">
      <div className="logo">
        <img src={background} alt="" />
      </div>
      <div className="user-data-specific">
        <h2>{userSpecificData.name}</h2>
        <div className="all-user-specific-data">
          <div className="user-data-get">
            <p><strong>Username: </strong>{userSpecificData.username}</p>
            <p><strong>Email: </strong>
            {
              edit === true ?
              ( <input type="text" onChange={handleChange} name="email" value={formData.email} /> ) :
              ( <a href={`mailto:${userSpecificData.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>{userSpecificData.email}</a> )
            }
            </p>
            <p><strong>Phone: </strong>
            {
              edit === true ?
              ( <input type="phone" onChange={handleChange} name="phone" value={formData.phone} /> ) :
              ( userSpecificData.phone )
            }
            </p>
            <p><strong>Address: </strong>
            {
              edit === true ? 
              ( <input type="text" onChange={handleChange} name="address" value={formData.address} /> ) :
              ( userSpecificData.address )
            }
            </p>
            <p><strong>Company: </strong>
            {
              edit === true ? 
              ( <input type="text" onChange={handleChange} name="company" value={formData.company} /> ) :
              ( <a href={addProtocolToURL(userSpecificData.website)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{userSpecificData.company}</a> ) 
            }
            </p>
            <p><strong>Website: </strong>
            {
              edit === true ?
              ( <input type="text" onChange={handleChange} name="website" value={formData.website} /> ) :
              ( <a href={addProtocolToURL(userSpecificData.website)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{extractDomain(userSpecificData.website)}</a> )
            }
            </p>
          </div>
          <div className="user-image-specifice">
            <label htmlFor="file-input">
                <img src={image ? URL.createObjectURL(image) : userSpecificData.avatar} alt="" />
            </label>
            <input onChange={imageHandler} type="file" name="image" id="file-input" hidden/>
          </div>
        </div>
      </div>
      <div className="user-change-data-buttons">
          <button onClick={handleSaveUserData}><p>SAVE</p></button>
          <button onClick={handleEdit}><p>EDIT</p></button>
          <button onClick={navigateToHome}><p>BACK</p></button>
      </div>
    </div>
  );
};

export default UserData;

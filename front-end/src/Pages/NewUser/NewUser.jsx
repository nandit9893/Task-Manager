import React, { useContext, useState } from "react";
import background from "../../assets/background.jpg";
import upload_area from "../../assets/upload_area.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./NewUser.css";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
const NewUser = () => {
  const { url } = useContext(AppContext);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    company: "",
    website: "",
    image: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const imageHandler = (event) => {
    setImage(event.target.files[0]);
  };

  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  const handleSave = async (event) => {
    event.preventDefault();     
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("address", data.address);
    formData.append("company", data.company);
    formData.append("website", data.website);
    if (image) {
      formData.append("avatar", image);
    }
    const newURL = `${url}/user/management/save/user/data`;
    try {
      const response = await axios.post(newURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success(`New user added successfully & user id is ${response.data.data.username.toUpperCase()}`);
        setData({
          name: "",
          email: "",
          phone: "",
          address: "",
          company: "",
          website: "",
          image: "",
        });
        setImage(false);
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
    <div className="newuser">
      <img src={background} alt="" />
      <div className="newuser-data">
        <h2>New Entry</h2>
        <div className="adding-new-user-details">
          <div className="text-data">
          <p><strong>Name: </strong><input type="text" name="name" value={data.name} onChange={onChangeHandler} placeholder="Type here" /></p>
          <p><strong>Email: </strong><input type="email" name="email" value={data.email} onChange={onChangeHandler} placeholder="Type here" /></p>
          <p><strong>Phone: </strong><input type="phone" name="phone" value={data.phone} onChange={onChangeHandler} placeholder="Type here" /></p>
          <p><strong>Address: </strong><input type="text" name="address" value={data.address} onChange={onChangeHandler} placeholder="Type here" /></p>
          <p><strong>Company: </strong><input type="text" name="company" value={data.company} onChange={onChangeHandler} placeholder="Type here" /></p>
          <p><strong>Website: </strong><input type="text" name="website" value={data.website} onChange={onChangeHandler} placeholder="Type here" /></p>
          </div>
          <div className="user-image">
            <label htmlFor="file-input">
              <img src={image ? URL.createObjectURL(image) : upload_area} alt="" />
            </label>
            <input onChange={imageHandler} type="file" name="image" id="file-input" hidden/>
          </div>
        </div>
      </div>
      <div className="changes-button">
        <button onClick={handleSave}><p>SAVE</p></button>
        <button onClick={navigateToHome}><p>BACK</p></button>
      </div>
    </div>
  );
};

export default NewUser;

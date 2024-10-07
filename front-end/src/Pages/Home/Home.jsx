import React, { useContext, useEffect } from "react";
import background from "../../assets/background.jpg";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const { userData, gettingUserData, url } = useContext(AppContext);

  useEffect(() => {
    gettingUserData();
  }, []);

  const handleUser = (userID) => {
    navigate(`userID/${userID}`); 
  };

  const addProtocolToURL = (url) => {
    try {
      const normalizedURL = url.startsWith('http://') || url.startsWith('https://') ? url : `http://${url}`;
      return normalizedURL;
    } catch (error) {
      return url;
    }
  };

  const handleDelete = async (userID) => {
    const newURL = `${url}/user/management/delete/user/${userID}`;
    try {
      const response = await axios.post(newURL);
      if(response.data.success) {
        toast.success(`${userID.toUpperCase()} deleted successfully`);
        await gettingUserData();
      } else {
        toast.error(response.data.message || "Failed to delete the user.");
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

  function extractDomain(url) {
    try {
      const { hostname } = new URL(url);
      return hostname;
    } catch (error) {
      return null;
    }
  }
    

  return (
    <div className="home">
      <img src={background} alt="" />
      <div className="home-user-data">
        <h2>Users Information</h2>
        <div className="home-user-details">
          <ul className="header">
            <li>Username</li>
            <li>Name</li>
            <li>Email</li>
            <li>Phone</li>
            <li>Address</li>
            <li>Company</li>
            <li>Website</li>
            <li>Delete</li>
          </ul>
          {
            userData.map((user) => (
              <div className="row" key={user._id}>
                <p onClick={() => handleUser(user.username)}>{user.username.toUpperCase()}</p> 
                <p>{user.name}</p>
                <p><a href={`mailto:${user.email}`} style={{ textDecoration: 'none', color: 'inherit' }}>{user.email}</a></p>
                <p>{user.phone}</p>
                <p>{user.address}</p>
                <p><a href={addProtocolToURL(user.website)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{user.company}</a></p>
                <p><a href={addProtocolToURL(user.website)} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>{extractDomain(user.website)}</a></p>
                <p className="old" onClick={()=>handleDelete(user.username)}>DELETE</p>
              </div>
            ))
          }
        </div>
      </div>
      <div className="add-user">
        <button onClick={()=>navigate("/newuser")}><p>New User</p></button>
      </div>
    </div>
  );
};

export default Home;

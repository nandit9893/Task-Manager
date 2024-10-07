import React from "react";
import Home from "./Pages/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import UserData from "./Components/UserData/UserData";
import NewUser from "./Pages/NewUser/NewUser";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userID/:userID" element={<UserData />} />
        <Route path="/newuser" element={<NewUser />} />
      </Routes>
      <ToastContainer />
    </div>
  );
};

export default App;

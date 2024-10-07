import React from "react";
import "./Navbar.css";
import task_logo from "../../assets/task_logo.jpeg";
const Navbar = () => {
  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={task_logo} alt="" />
        <h1>User Management</h1>
      </div>
      <div className="right-navbar">
        <ul>
          <li>Home</li>
          <li>About</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

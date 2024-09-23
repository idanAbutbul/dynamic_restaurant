import React from "react";
import { Link } from "react-router-dom";
import "./MainPage.css";

function MainPage({ user }) {
  return (
    <>
      <div className="main-page-container">
        <div className="main-page">
          <h1>Welcome to Our Restaurant Reservation System</h1>
          <p className="main-page-p">Choose an option to continue:</p>
          <div className="main-page-buttons">
            <Link to="/login">
              <button className="main-page-button">Login</button>
            </Link>
            <Link to="/register">
              <button className="main-page-button">Register</button>
            </Link>
            {user && user.id === 1 && (
              <Link to="/admin">
                <button className="main-page-button">Admin Panel</button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;

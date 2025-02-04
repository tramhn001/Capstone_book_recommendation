import React from "react";
import LoginForm from "../components/LoginForm";
import "../styles/LoginPage.css";


const LoginPage = ({ setIsLoggedIn }) => {
  return (
    <div className="login-page-container">
      <h1>Welcome to BookBuddy</h1>
      <div className="login-form-wrapper">
        <LoginForm setIsLoggedIn={setIsLoggedIn} />
      </div>
    </div>
  );
};

export default LoginPage;
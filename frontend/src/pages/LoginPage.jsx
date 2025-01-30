import React from "react";
import LoginForm from "../components/auth/LoginForm";
import "../styles/LoginPage.css";

const LoginPage = () => {
  return (
    <div className="login-page-container">
      <h1>Welcome to BookBuddy</h1>
      <div className="login-form-wrapper">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
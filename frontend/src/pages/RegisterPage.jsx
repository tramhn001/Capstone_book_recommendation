import React from "react";
import RegisterForm from "../components/auth/RegisterForm";
import "../styles/RegisterPage.css";


const RegisterPage = () => {
  return (
    <div className="register-page-container">
      <h1>Join Book Buddy today and start discovering your next favorite book! </h1>
      <div className="register-form-wrapper">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
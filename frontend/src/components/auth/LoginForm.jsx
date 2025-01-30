import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // For making API requests
import "../../styles/LoginForm.css"; 

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Basic validation
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Replace with deployed API endpoint later
      const response = await axios.post("http://localhost:8000/api/user/login", {
        email,
        password,
      });

      // Extract tokens from response
      const { access, refresh } = response.data;

      // save token in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // redirect to the user profile
      navigate("/access/profile");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
};


  return (
    <div className="login-form-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/register">Register here</a>.
      </p>
    </div>
  );
};

export default LoginForm;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "../styles/LoginForm.css"; 

const LoginForm = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("test123@gmail.com");
  const [password, setPassword] = useState("12345");
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
      const backendURL = import.meta.env.VITE_APP_BACKEND_URL;
      const response = await axios.post(`${backendURL}/api/user/login/`, {
        username: email,
        password,
      });

      // Extract tokens from response
      const { access, refresh } = response.data;
      console.log(response.data); 
      // save token in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      setIsLoggedIn(true);
      // redirect to the user profile
      navigate("/profile");
    } catch (err) {
      console.log("Error here");
      console.log(err);
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
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
            autoComplete="username"
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
            autoComplete="current-password"
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
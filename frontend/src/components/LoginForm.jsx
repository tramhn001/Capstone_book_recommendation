import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios"; 
import "../styles/LoginForm.css"; 

const LoginForm = ({ setIsLoggedIn }) => {
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
      const backendURL = import.meta.env.VITE_APP_BACKEND_URL;
      const response = await axios.post(`${backendURL}/api/user/login/`, {
        username: email,
        password,
      });

      // Extract tokens from response
      const { access, refresh } = response.data;
      // save token in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      setIsLoggedIn(true);
      // redirect to the user profile
      navigate("/profile");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Invalid credentials. Please try again.");
      } else {
        setError("Login failed. Please try again.");
      }
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
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default LoginForm;
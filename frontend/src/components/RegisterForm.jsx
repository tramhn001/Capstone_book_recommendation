import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterForm.css";

const RegisterForm = () => {
	const [username, setUsername] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [error, setError] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);
	const navigate = useNavigate();

	const backendURL = import.meta.env.VITE_APP_BACKEND_URL;
	const handleSubmit = async (event) => {
		event.preventDefault();
		setError("");

		if (!username || !email || !password || !confirmPassword) {
			setError("Please fill in all fields.");
			return;
		}

		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setIsLoading(true);
		setError("");

		try {
			const response = await axios.post(`${backendURL}/api/user/register/`, {
				username,
				email,
				password,
			});

			if (response.status === 201) {
				// Auto login after registration
				const loginResponse = await axios.post(`${backendURL}/api/token/`, {
						username: email,
						password,
				});
				
				localStorage.setItem("accessToken", loginResponse.data.access);
				localStorage.setItem("refreshToken", loginResponse.data.refresh);

				navigate("/profile"); // Redirect to profile page after successful registration and login
			}
		} catch (err) {
			if (err.response && err.response.data) {
				setError(err.response.data.error || "Registration failed. Please try again.");
			} else {
				setError("Registration failed. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="register-form-container">
			<h2>Registration</h2>
			{error && <p className="error-message">{error}</p>}
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Enter your username"
						required
						autoComplete="username"
					/>
				</div>
				<div className="form-group"> 
					<label htmlFor="email">Email</label>
					<input 
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email"
						required
						autoComplete="email"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter your password"
						required
						autoComplete="new-password"
					/>
				</div>
				<div className="form-group">
					<label htmlFor="confirmPassword">Confirm Password</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						placeholder="Confirm your password"
						required
						autoComplete="new-password"
					/>
				</div>
				<button type="submit" disabled={isLoading}>
					{isLoading ? "Registering..." : "Register"}
				</button>
			</form>
			<p>
				Already have an account? <a href="/login">Login here</a>.
			</p>
		</div>
	);
};

export default RegisterForm;
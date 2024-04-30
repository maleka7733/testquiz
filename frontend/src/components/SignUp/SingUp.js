import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

const SignUp = ({ setToken }) => {
	const [username, setUsername] = useState("");
	const [usernameError, setUsernameError] = useState("");
	const [password, setPassword] = useState("");
	const [isFormValid, setIsFormValid] = useState(false);
	const [displayMessage, setDisplayMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		setIsFormValid(username.length >= 5 && password.length > 0);
	}, [username, password]);

	const handleUsernameChange = (e) => {
		const newUsername = e.target.value;

		setUsername(newUsername);

		// Validate username length
		if (newUsername.length < 5) {
			setUsernameError("Username must be at least 5 characters");
		} else {
			setUsernameError("");
		}
	};

	const handleSignUp = (e) => {
		e.preventDefault();
		if (!isFormValid) {
			console.log("Form is not valid");
			return;
		}

		axios
			.post(`${process.env.REACT_APP_API_URL}/user/`, { username, password })
			.then((response) => {
				if (response.status === 200) {
					console.log("Successfully signed up!");
					setDisplayMessage("Successfully signed up!");
				}
			})
			.catch((error) => {
				console.error("Error signup:", error);
				setUsernameError("Username already exists or other signup error");
			});
	};

	return (
		<>
			<>
				<div className="sign_up_container">
					<h2 className="sign_up_h2">Sign Up</h2>
					<form onSubmit={handleSignUp}>
						<label>Username:</label>
						<input
							type="text"
							className="sign_up_component"
							placeholder="Enter a username"
							value={username}
							onChange={handleUsernameChange}
						/>
						{usernameError && <p className="error_message">{usernameError}</p>}
						<label>Password:</label>
						<input
							type="password"
							className="sign_up_component"
							placeholder="Enter a password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<button
							type="submit"
							className={`sign_up_button ${!isFormValid ? "sign_up_button_disabled" : ""}`}
							disabled={!isFormValid}
						>
							Sign Up
						</button>
					</form>
					{displayMessage && <p className="success_message">{displayMessage}</p>}
				</div>
				<div>
					<button className="transition_button" onClick={() => navigate("/")}>
						Already have an account? Click here to Login!
					</button>
				</div>
			</>
		</>
	);
};

export default SignUp;

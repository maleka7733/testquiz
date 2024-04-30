import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = ({ setToken }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const [isFormValid, setIsFormValid] = useState(false);

	const navigate = useNavigate();

	useEffect(() => {
		setIsFormValid(username.length >= 5 && password.length > 0);
	}, [username, password, errors.login]);

	const validateField = (name, value) => {
		let fieldErrors = { ...errors };

		switch (name) {
			case "username":
				if (!value) {
					fieldErrors["username"] = "Please enter your username";
				} else {
					delete fieldErrors["username"];
				}
				break;

			case "password":
				if (!value) {
					fieldErrors["password"] = "Please enter your password";
				} else {
					delete fieldErrors["password"];
				}
				break;

			default:
				break;
		}

		setErrors(fieldErrors);
	};

	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
		validateField("username", e.target.value);
		if (errors.login) {
			setErrors((prevErrors) => ({ ...prevErrors, login: undefined }));
		}
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
		validateField("password", e.target.value);
		if (errors.login) {
			setErrors((prevErrors) => ({ ...prevErrors, login: undefined }));
		}
	};

	const handleLogin = (event) => {
		event.preventDefault();

		if (errors.login) {
			setErrors((prevErrors) => ({ ...prevErrors, login: undefined }));
		}

		if (Object.keys(errors).length === 0 || (Object.keys(errors).length === 1 && !errors.login)) {
			axios
				.post(`${process.env.REACT_APP_API_URL}/user/login`, { username, password })
				.then((response) => {
					if (response.status === 200) {
						console.log("Successfully signed in!");
						localStorage.setItem("token", response.data.token);
						localStorage.setItem("username", username);
						setToken(response.data.token);
						navigate("/");
					}
				})
				.catch((error) => {
					console.error("Error logging in", error);
					setErrors({ ...errors, login: "Invalid username or password" });
				});
		}
	};

	const handleSignUp = async () => {
		navigate("/signUp");
	};

	return (
		<div className="login">
			<h2>Login or Sign Up</h2>

			<form onSubmit={handleLogin}>
				<label>Username:</label>
				<input
					placeholder="Enter your username"
					type="text"
					value={username}
					onChange={handleUsernameChange}
				/>
				<div className="error">{errors.username}</div>

				<label>Password:</label>
				<input
					placeholder="Enter your password"
					type="password"
					value={password}
					onChange={handlePasswordChange}
				/>
				<div className="error">{errors.password}</div>

				<button
					type="submit"
					disabled={!isFormValid}
					className={`login_button ${!isFormValid ? "login_button_disabled" : ""}`}
				>
					Login
				</button>
			</form>
			{errors.login && <div className="error">{errors.login}</div>}

			<button className="transition_button" onClick={handleSignUp}>
				Don't have an account? Click here to Sign Up!
			</button>
		</div>
	);
};

export default Login;

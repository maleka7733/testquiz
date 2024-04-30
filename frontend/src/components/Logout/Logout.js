import React from "react";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

const Logout = ({ setToken, setIsAuthenticated }) => {
	localStorage.removeItem("token");
	localStorage.removeItem("username");
	setToken(null);
	setIsAuthenticated(false);
	const navigate = useNavigate();

	return (
		<>
			<div className="logOut">
				<h2>You have been logged out</h2>
				<p>Please log in again to continue</p>
				<button onClick={(e) => navigate("/")} to="/">
					Login
				</button>
			</div>
		</>
	);
};

export default Logout;

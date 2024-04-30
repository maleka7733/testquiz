import React from "react";
import { useNavigate } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
	const navigate = useNavigate();

	return (
		<footer>
			<button onClick={() => navigate("/logout")}>Logout</button>
		</footer>
	);
};

export default Footer;

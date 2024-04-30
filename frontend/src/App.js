import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header/Header";
import LandingPage from "./components/LandingPage/LandingPage";
import PreviousQuizes from "./components/PreviousQuizes/PreviousQuizes";
import Logout from "./components/Logout/Logout";
import Login from "./components/Login/Login";
import Footer from "./components/Footer/Footer";
import { Route, Routes } from "react-router-dom";
import QuizPage from "./components/QuizPage/QuizPage";
import SignUp from "./components/SignUp/SingUp";
import axios from "axios";

function App() {
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [quizSettings, setQuizSettings] = useState({});

	useEffect(() => {
		const localToken = localStorage.getItem("token");

		const validateToken = async () => {
			if (localToken) {
				try {
					const response = await axios.get(`${process.env.REACT_APP_API_URL}/token/validate`, {
						headers: { Authorization: `Bearer ${localToken}` },
					});
					if (response.status === 200) {
						setToken(localToken);
						setIsAuthenticated(true);
					}
				} catch (error) {
					// Handle token validation failure
					localStorage.removeItem("token"); // Remove invalid token
					setToken(null);
					setIsAuthenticated(false);
				}
			} else {
				setToken(null);
				setIsAuthenticated(false);
			}
		};

		validateToken();
	}, [token]);

	const startQuiz = (settings) => {
		setQuizSettings(settings);
		// Landing page will redirect to Quiz Component at this stage
	};

	return (
		<div className="container">
			<Routes>
				<Route
					path="/"
					element={
						isAuthenticated ? (
							<div className="content">
								<Header />
								<LandingPage onStartQuiz={startQuiz} />
								<PreviousQuizes />
								<Footer />
							</div>
						) : (
							<div className="content">
								<Header />
								<Login setToken={setToken} />
							</div>
						)
					}
				/>
				<Route
					path="/quiz"
					element={
						isAuthenticated ? (
							<div className="content">
								<Header />
								<QuizPage settings={quizSettings} />
								<Footer />
							</div>
						) : (
							<div className="content">
								<Header />
								<Login setToken={setToken} />
							</div>
						)
					}
				/>
				<Route
					path="/login"
					element={
						<div className="content">
							<Header />
							<Login setToken={setToken} />
						</div>
					}
				/>
				<Route
					path="/signup"
					element={
						<div className="content">
							<Header />
							<SignUp />
						</div>
					}
				/>
				<Route
					path="/logout"
					element={
						<div className="content">
							<Header />
							<Logout setToken={setToken} setIsAuthenticated={setIsAuthenticated} />
						</div>
					}
				/>
			</Routes>
		</div>
	);
}

export default App;

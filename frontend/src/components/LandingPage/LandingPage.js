import React, { useState, useEffect } from "react";
import { fetchTriviaCategories } from "../../api/triviaAPI";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LandingPage = ({ onStartQuiz }) => {
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState({ id: 9, name: "General Knowledge" });
	const [difficulty, setDifficulty] = useState("easy");
	const [numberOfQuestions, setNumberOfQuestions] = useState(10);
	const navigate = useNavigate();

	useEffect(() => {
		const loadCategories = async () => {
			const retrievedCategories = await fetchTriviaCategories();
			const processCategories = retrievedCategories.map((category) => {
				if (category.name.includes(":")) {
					const parts = category.name.split(":");
					return {
						...category,
						name: parts.slice(1).join(":").trim(),
					};
				} else {
					return category;
				}
			});
			setCategories(processCategories);
		};
		loadCategories();
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		onStartQuiz({ selectedCategory, difficulty, numberOfQuestions });
		navigate("/quiz/");
	};

	const handleCategoryChange = (e) => {
		const categoryId = e.target.value;
		const categoryOject = categories.find((cat) => cat.id.toString() === categoryId);
		setSelectedCategory(categoryOject);
	};

	return (
		<div className="landing-page-wrapper">
			<form className="card" onSubmit={handleSubmit}>
				<div>
					<label>Category:</label>
					<select value={selectedCategory?.id || ""} onChange={handleCategoryChange}>
						{categories.map((category) => (
							<option key={category.id} value={category.id}>
								{category.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label>Difficulty:</label>
					<select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
						<option value="easy">Easy</option>
						<option value="medium">Medium</option>
						<option value="hard">Hard</option>
					</select>
				</div>
				<div>
					<label>Number of Questions:</label>
					<input
						type="number"
						value={numberOfQuestions}
						onChange={(e) => setNumberOfQuestions(e.target.value)}
						min="1"
						max="50"
					/>
				</div>
				<button type="submit">Start Quiz</button>
			</form>
		</div>
	);
};

export default LandingPage;

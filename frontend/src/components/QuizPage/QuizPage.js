import React, { useEffect, useState } from "react";
import { fetchQuestions } from "../../api/triviaAPI";
import QuizQuestion from "../QuizQuestion/QuizQuestion";
import { useNavigate } from "react-router-dom";
import "./QuizPage.css";
import axios from "axios";

const QuizPage = ({ settings }) => {
	const [questions, setQuestions] = useState([]);
	const [userAnswers, setUserAnswers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [score, setScore] = useState(null);
	const [showReview, setShowReview] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const addQuizResultToDatabase = async () => {
			const token = localStorage.getItem("token");
			const headers = { Authorization: `Bearer ${token}` };

			const quizResult = {
				category: settings.selectedCategory.name,
				difficulty: settings.difficulty,
				numberOfQuestions: settings.numberOfQuestions,
				score,
			};

			try {
				const response = await axios.post(
					`${process.env.REACT_APP_API_URL}/quizResults`,
					quizResult,
					{
						headers,
					}
				);

				if (response.status === 201) {
					console.log("Quiz result added to database");
				}
			} catch (error) {
				console.error("Error adding quiz result to database:", error);
			}
		};
		if (showReview && score !== null) {
			addQuizResultToDatabase();
		}
	}, [score]);

	useEffect(() => {
		const loadQuestions = async () => {
			if (
				!settings ||
				!settings.selectedCategory ||
				!settings.difficulty ||
				!settings.numberOfQuestions ||
				!settings.selectedCategory.id
			) {
				navigate("/");
				return;
			}

			const questions = await fetchQuestions(
				settings.numberOfQuestions,
				settings.difficulty,
				settings.selectedCategory.id
			);
			if (questions) {
				setQuestions(questions);
				setUserAnswers(Array(questions.length).fill(null));
				setLoading(false);
			} else {
				console.error("API did not return expected data:", questions);
			}
		};
		loadQuestions();
	}, [settings, navigate]);

	const handleAnswerSelected = (option) => {
		const updatedAnswers = [...userAnswers];
		updatedAnswers[currentQuestionIndex] = option;
		setUserAnswers(updatedAnswers);
	};

	const handleNextQuestion = () => {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		} else {
			setShowReview(true);
			handleCheckAnswers(); // Check answers and show results at the end
		}
	};

	const handleCheckAnswers = () => {
		let correctCount = 0;
		userAnswers.forEach((answer) => {
			if (answer && answer.correct) {
				correctCount++;
			}
		});
		setScore(correctCount);
	};

	if (loading) return <div>Loading...</div>;

	if (showReview) {
		return (
			<div className="quiz_container">
				<div className="results">{`${score} out of ${questions.length} correct`}</div>
				<h2>Your Results</h2>
				{questions.map((questionData, index) => (
					<QuizQuestion
						key={index}
						questionData={questionData}
						selectedOption={userAnswers[index]}
						reviewMode={true}
					/>
				))}

				<button className="return-home-button" onClick={() => navigate("/")}>
					Home
				</button>
			</div>
		);
	}

	return (
		<div className="quiz_container">
			<QuizQuestion
				questionData={questions[currentQuestionIndex]}
				selectedOption={userAnswers[currentQuestionIndex]}
				onAnswerSelected={handleAnswerSelected}
			/>
			<button className="next_question" onClick={handleNextQuestion}>
				{currentQuestionIndex < questions.length - 1 ? "Next Question" : "Submit Answers"}
			</button>
		</div>
	);
};

export default QuizPage;

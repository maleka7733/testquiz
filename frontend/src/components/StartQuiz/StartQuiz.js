import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const StartQuiz = () => {
	const location = useLocation(); // Access the location object
	const searchParams = new URLSearchParams(location.search); // Parse the search string
	const query = searchParams.get("query"); // Get specific query parameter
	const [questions, setQuestions] = useState([]);

	useEffect(() => {
		setQuestions([]); // Clear questions array on effect run (search query change
		const handler = setTimeout(() => {
			const fetchData = async () => {
				const res = await axios.get(`${process.env.REACT_APP_API_URL}/questions?keyword=${query}`);
				setQuestions(res.data);
			};
			if (query) {
				fetchData();
			}
		}, 500); // Delay API call by 500ms

		return () => clearTimeout(handler); // Cleanup on effect re-run or component unmount
	}, [query]);

	if (questions.length < 1) {
		return <div>Building a quiz based on your keyword...</div>;
	}

	return (
		<div>
			<h1>Starrrrrrt Quiz</h1>
			<p>Search Query: {query}</p>
			<ul>
				{questions.map((question) => (
					<li key={question.question}>{question.question}</li>
				))}
			</ul>
		</div>
	);
};

export default StartQuiz;

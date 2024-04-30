import React, { useEffect, useState } from "react";
import "./PreviousQuizes.css";
import axios from "axios";

const PreviousQuizes = () => {
	const [previousResults, setPreviousResults] = useState([]);

	useEffect(() => {
		const token = localStorage.getItem("token");
		const headers = { Authorization: `Bearer ${token}` };

		const fetchPreviousResults = async () => {
			try {
				// Fetch previous quiz results from the server
				const response = await axios.get(`${process.env.REACT_APP_API_URL}/quizResults`, {
					headers,
				});
				setPreviousResults(response.data);
			} catch (error) {
				console.error("Error fetching previous quiz results:", error);
			}
		};

		fetchPreviousResults();
	}, []);

	return (
		<div className="previous-quizes">
			<h2 className="quiz-results-heading">Previous Quiz Results</h2>
			<table className="quiz-results-table">
				<thead>
					<tr>
						<th className="table-header">Category</th>
						<th className="table-header">Difficulty</th>
						<th className="table-header"># Questions</th>
						<th className="table-header">Score</th>
					</tr>
				</thead>
				<tbody>
					{previousResults.map((result, index) => (
						<tr key={index}>
							<td className="table-cell">{result.category}</td>
							<td className="table-cell">{result.difficulty}</td>
							<td className="table-cell">{result.numberOfQuestions}</td>
							<td className="table-cell">{result.score}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default PreviousQuizes;

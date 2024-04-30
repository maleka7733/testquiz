const express = require("express");
const router = express.Router();
const axios = require("axios");

// Utility function to delay between requests
function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// Route to fetch questions
router.get("/", async (req, res) => {
	try {
		const { keyword, desiredCount = 5 } = req.query; // get the keyword and desired count from the query string
		console.log("keyword", keyword, "desiredCount", desiredCount);
		if (!keyword) {
			return res.status(400).json({ error: "Keyword is required" });
		}

		let accumulatedQuestions = [];
		const maxAttempts = 10; // Limit the number of API requests to avoid excessive calls
		let attempts = 0;

		while (accumulatedQuestions.length < desiredCount && attempts < maxAttempts) {
			attempts++;
			console.log("Attempt", attempts, "Fetching questions...");
			// Fetch questions from open trivia database
			const response = await axios.get(`https://opentdb.com/api.php?amount=50`);
			const questions = response.data.results; // Extract the questions from the response

			// Filter questions by keyword in question or category
			const filteredQuestions = questions.filter(
				(question) =>
					question.question.toLowerCase().includes(keyword.toLowerCase()) ||
					question.category.toLowerCase().includes(keyword.toLowerCase())
			);

			// Add filtered questions to the accumulated questions
			accumulatedQuestions = accumulatedQuestions.concat(filteredQuestions);

			// Check if we have enough questions
			if (accumulatedQuestions.length >= desiredCount) {
				break;
			}

			// Delay the next API call
			await delay(5000); // Delay of 5 seconds
		}

		// If we reach here and still not enough questions, we handle it by slicing to desiredCount
		res.json(accumulatedQuestions.slice(0, desiredCount));
	} catch (error) {
		console.error("Failed to fetch questions:");
		handleErrorResponse(res, error); // Refactor error handling into a function for cleaner code
	}
});

function handleErrorResponse(res, error) {
	if (error.response) {
		res.status(error.response.status).json({
			error: "Error fetching data from trivia API",
			details: error.response.data,
		});
	} else if (error.request) {
		res.status(503).json({ error: "No response received from trivia API" });
	} else {
		res.status(500).json({ error: "Error making request to trivia API" });
	}
}

module.exports = router;

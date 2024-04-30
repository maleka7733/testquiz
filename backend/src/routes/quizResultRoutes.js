const User = require("../models/User");
const QuizResult = require("../models/QuizResult");
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authentication");

// GET all quiz results for a user
router.get("/", authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		// Check if user exists
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Get all quiz results for the user
		const quizResults = await QuizResult.find({ user: req.user.id });
		res.json(quizResults);
	} catch (err) {
		console.log("error: ", err.message);
		res.status(500).json({ message: err.message });
	}
});

// Save a quiz result for a user
router.post("/", authenticateToken, async (req, res) => {
	try {
		const user = await User.findById(req.user.id);

		// Check if user exists
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// create a new quiz result and add it to the user's quizResults array
		const { category, difficulty, numberOfQuestions, score } = req.body;

		const newQuizResult = new QuizResult({
			category: category,
			difficulty: difficulty,
			numberOfQuestions: numberOfQuestions,
			score: score,
			user: req.user.id,
		});

		await newQuizResult.save();

		user.quizResults.push(newQuizResult._id);
		await user.save();
		res.status(201).json({ message: "Quiz result saved" });
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

module.exports = router;

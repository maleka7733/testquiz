const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const quizResultSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	category: {
		type: String,
		required: true,
	},
	difficulty: {
		type: String,
		required: true,
	},
	numberOfQuestions: {
		type: Number,
		required: true,
	},
	score: {
		type: Number,
		required: true,
	},
});

const QuizResult = mongoose.model("QuizResult", quizResultSchema);

module.exports = QuizResult;

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		set: function (password) {
			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(password, salt);
			return hash;
		},
	},
	quizResults: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "QuizResult",
		},
	],
});

const User = mongoose.model("User", userSchema);

module.exports = User;

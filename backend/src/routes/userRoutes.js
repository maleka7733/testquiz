const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/authentication");

// GET all users
router.get("/", authenticateToken, async (req, res) => {
	try {
		console.log("Hit get all users");
		const users = await User.find();

		console.log("Found users: ", users);
		res.json(users);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

// GET a single user by ID
router.get("/:id", authenticateToken, getUser, (req, res) => {
	res.json(res.user);
});

// SIGNUP a new user
router.post("/", async (req, res) => {
	const user = new User({
		username: req.body.username,
		password: req.body.password,
	});

	try {
		const newUser = await user.save();
		res.status(200).json(newUser);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// UPDATE a user by ID
router.patch("/:id", authenticateToken, getUser, async (req, res) => {
	if (req.body.username != null) {
		res.user.username = req.body.username;
	}
	if (req.body.password != null) {
		res.user.password = req.body.password;
	}

	try {
		const updatedUser = await res.user.save();
		res.json(updatedUser);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
});

// DELETE a user by ID
router.delete("/:id", authenticateToken, async (req, res) => {
	try {
		const result = await User.findByIdAndDelete(req.params.id);
		if (!result) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json({ message: "User deleted" });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

async function getUser(req, res, next) {
	let user;
	try {
		user = await User.findById(req.params.id);
		if (user == null) {
			return res.status(404).json({ message: "User not found" });
		}
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}

	res.user = user;
	next();
}

// login route
router.post("/login", async (req, res) => {
	const user = await User.findOne({ username: req.body.username });

	if (user && (await bcrypt.compare(req.body.password, user.password))) {
		const token = jwt.sign(
			{
				id: user._id,
				username: user.username,
			},
			process.env.JWT_SECRET
		);

		res.json({
			message: "User logged in successfully",
			token: token,
		});
	} else {
		res.status(400).json({
			message: "Incorrect email or password, please try again",
		});
	}
});

router.post("/change-password", authenticateToken, async (req, res) => {
	console.log("Hit change password route");
	console.log("req.body: ", req.body);
	try {
		// Access the user's ID from the request object
		const userId = req.user.id;

		// Find the user in the database
		const user = await User.findById(userId);

		// Check if the user exists
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		} else {
			console.log("Found user: ", user);
		}

		// Check if the password in the request body matches the user's current password
		const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);

		// If the passwords don't match, return an error
		if (!isMatch) {
			return res.status(400).json({ message: "Incorrect password" });
		}

		// Update the user's password
		user.password = req.body.newPassword;

		// Save the user in the database
		await user.save();

		// Send a success message
		res.json({ message: "Password updated successfully" });
	} catch (err) {
		// Handle errors
		res.status(500).json({ message: "An error occurred" });
	}
});

module.exports = router;

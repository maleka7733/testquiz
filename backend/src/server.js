require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 8080;

const mongodbUrl = process.env.MONGODB_URL || "mongodb://mongo:27017/mydatabase";

console.log("mongodbUrl:", mongodbUrl);

mongoose
	.connect(mongodbUrl)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.log("MongoDB connection error:", err));

app.use(cors());
app.use(express.json());
app.use(routes);

// Catch-all handler for React app
app.get("*", (req, res) => {
	res.status(404).json({ message: "Endpoint not found" });
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

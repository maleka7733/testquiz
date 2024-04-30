const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authentication");

router.get("/validate", authenticateToken, (req, res) => {
	// If we reach this point, the token was valid
	res.sendStatus(200);
});

module.exports = router;

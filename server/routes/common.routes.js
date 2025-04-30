const express = require("express");
const router = express.Router();

const resetPassword = require("../controllers/reset.password");

router.patch("/resetPassword", resetPassword);

module.exports = router;

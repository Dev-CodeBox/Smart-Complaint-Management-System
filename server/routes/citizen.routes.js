const express = require("express");
const router = express.Router();

const { sendOtp, verifyOtp } = require("../controllers/otp");
const signup = require("../controllers/sign.up");

const login = require("../controllers/login");
const { citizenAuthorization } = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");

const registerComplaint = require("../controllers/register.complaint");
const getComplaints = require("../controllers/get.complaints");
const upvote = require("../controllers/upvote");

router.post("/sendOtp", sendOtp);
router.post("/verifyOtp", verifyOtp);
router.post("/signup", signup);

router.post("/login", login);

router.post(
  "/registerComplaint",
  authentication,
  citizenAuthorization,
  registerComplaint
);

router.get(
  "/getComplaints",
  authentication,
  citizenAuthorization,
  getComplaints
);

router.patch("/upvote", authentication, citizenAuthorization, upvote);

module.exports = router;

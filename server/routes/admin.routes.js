const express = require("express");
const router = express.Router();

const login = require("../controllers/login");
const { adminAuthorization } = require("../middlewares/authorization");
const authentication = require("../middlewares/authentication");

const getComplaints = require("../controllers/get.complaints");

const {
  updateStatusToProgress,
  updateStatusToResolved,
} = require("../controllers/update.status");

router.post("/login", login);
router.get("/getComplaints", authentication, adminAuthorization, getComplaints);

router.patch(
  "/complaint/:complaintId/in-progress",
  authentication,
  adminAuthorization,
  updateStatusToProgress
);
router.patch(
  "/complaint/:complaintId/resolve",
  authentication,
  adminAuthorization,
  updateStatusToResolved
);

module.exports = router;

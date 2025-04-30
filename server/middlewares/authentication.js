const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    const token = req.headers["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.citizen = decoded;
    req.citizenId = decoded.id;
    req.role = decoded.role;
    if (token === "null") {
      return res.status(401).json({
        message: "Session expired",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = authentication;

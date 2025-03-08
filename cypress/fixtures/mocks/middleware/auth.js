const authenticateToken = (request, response, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return response.status(401).json({
      error: "Missing Bearer token",
    });
  }

  // For mock purposes, we're just checking if the token exists
  next();
};

module.exports = { authenticateToken };

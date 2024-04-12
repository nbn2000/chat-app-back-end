const tokenService = require("../Service/token.service");

const auth = async (req, res, next) => {
  const path = req.path;
  console.log(path);
  if (path === "/signin" || path === "/signup") {
    return next();
  }

  try {
    const token = req?.headers?.authorization?.split(" ").pop() || null;
    const decodedToken = await tokenService.verifyToken(token);
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
        variant: "error",
      });
    } else {
      req.user = decodedToken;
      next();
    }
  } catch (err) {
    res.json(500).json({
      message: "Invalid token",
      variant: "error",
    });
  }
};

module.exports = auth;

import jsonwebtoken from "jsonwebtoken";
import User from "../models/user.js";

// jwt authentication
export const auth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  try {
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
      const { userId } = jsonwebtoken.verify(token, process.env.JWT_SECRET);

      req.userId = userId;
      next();
    }
  } catch (error) {
    return res.status(400).json({ error });
  }

  if (!token) {
    return res.status(400).json({ error: "No token", statusCode: 400 });
  }
};

// admin authorization
export const admin = async (req, res, next) => {
  try {
    const user = await User.findById({ _id: req.userId })
      .populate("role")
      .select("-password");

    if (!user.role.name === "ADMIN") {
      return res.status(404).json({
        error: "Unauthorized access",
        statusCode: 404,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(404).json({
      error: error.message,
      statusCode: 404,
    });
  }
};

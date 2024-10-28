import jsonwebtoken from "jsonwebtoken";
import { BlackListedJwt, User } from "../config/dbConfig.js";

// jwt authentication
export const auth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  try {
    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];

      const blackListedJwt = await BlackListedJwt.findOne({
        where: { jwt: token },
      });
      if (blackListedJwt)
        return res.status(400).json({ error: "Jwt is invalid" });

      const { userId } = jsonwebtoken.verify(token, process.env.JWT_SECRET);

      req.userId = userId;
      req.jwt = token;
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
    const user = await User.findOne({ id: req.userId });

    if (!user.role.name === "ADMIN") {
      return res.status(404).json({
        error: "This role type has no access to this resource.",
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

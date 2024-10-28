import { User, BlackListedJwt } from "../config/dbConfig.js";

export const addJwtToBlacklist = async (req, res, next) => {
  console.log("started");
  try {
    const jwt = req.jwt;
    await BlackListedJwt.build({ jwt }).save();
    res.status(201).json({ message: "Added successfully" });
  } catch (error) {
    console.log("Error====> ", error);
    return res.status(400).json({ error });
  }
};

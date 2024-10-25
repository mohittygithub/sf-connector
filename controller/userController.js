import { User } from "../config/dbConfig.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Incomplete form data" });
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (!existingUser)
      return res.status(400).json({ error: "Incorrect credentials" });

    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch)
      return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: existingUser.id,
        name: existingUser.first_name + " " + existingUser.last_name,
        role: existingUser.role,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(200).json({ token });
  } catch (error) {
    console.log("error====> ", error);
    return res.status(400).json({ error });
  }
};

export const register = async (req, res, next) => {
  const { first_name, last_name, email, password } = req.body;
  if (!first_name || !last_name || !email || !password)
    return res.status(400).json({ error: "Incomplete form data" });
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.build({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    }).save();
    res.status(201).json({ message: "Created successfully" });
  } catch (error) {
    console.log("error=====> ", error);
    return res.status(400).json({ error });
  }
};

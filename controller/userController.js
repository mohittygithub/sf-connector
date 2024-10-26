import { User } from "../config/dbConfig.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const minimumUserResponse = {
  id: "",
  first_name: "",
  last_name: "",
  email: "",
  role: "",
  is_active: "",
};

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

export const findAllUsers = async (req, res, next) => {
  try {
    const existingUsers = await User.findAll();
    let users = [];
    if (existingUsers.length > 0) {
      existingUsers.forEach((existingUser) => {
        minimumUserResponse.id = existingUser.id;
        minimumUserResponse.first_name = existingUser.first_name;
        minimumUserResponse.last_name = existingUser.last_name;
        minimumUserResponse.email = existingUser.email;
        minimumUserResponse.role = existingUser.role;
        minimumUserResponse.is_active = existingUser.is_active;
        users.push(minimumUserResponse);
      });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.log("error===> ", error);
    return res.status(400).json({ error });
  }
};

export const findUserById = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!existingUser)
      return res
        .status(401)
        .json({ error: `User not found with id: ${req.userId}` });

    minimumUserResponse.id = existingUser.id;
    minimumUserResponse.first_name = existingUser.first_name;
    minimumUserResponse.last_name = existingUser.last_name;
    minimumUserResponse.email = existingUser.email;
    minimumUserResponse.role = existingUser.role;
    minimumUserResponse.is_active = existingUser.is_active;

    res.status(200).json(minimumUserResponse);
  } catch (error) {
    return res.status(400).json({ error });
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({
      where: { id: req.params.userId },
    });
    if (!existingUser)
      return res
        .status(401)
        .json({ error: `User not found with id: ${req.params.userId}` });

    const { first_name, last_name, password, sf_org_id } = req.body;
    await User.update(
      {
        first_name: first_name && first_name,
        last_name: last_name && last_name,
        password: password && password,
        sf_org_id: sf_org_id && sf_org_id,
      },
      { where: { id: existingUser.id } }
    );

    res.status(201).json({ message: "Updated successfully" });
  } catch (error) {
    console.log("error===> ", error);
    return res.status(400).json({ error });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.update(
      { is_active: false },
      { where: { id: req.params.userId } }
    );
    res.status(200).json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("error===> ", error);
    return res.status(400).json({ error });
  }
};

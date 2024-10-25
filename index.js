import express, { response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  getAccessToken,
  refreshAccessToken,
} from "./service/SalesforceService.js";
import salesforceRoute from "./route/salesforceRoute.js";
import userRoute from "./route/userRoute.js";
import { dbConnect } from "./config/dbConfig.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRoute);
app.use("/sf", salesforceRoute);

// get access token from salesforce using grant_type=password
app.post("/get-access-token", async (req, res) => {
  const data = await getAccessToken();
  res.status(200).json({ data });
});

// refreshing salesforce access token using refresh token
app.post("/refresh-access-token", async (req, res) => {
  const data = await refreshAccessToken();
  res.status(200).json({ data });
});

const init = async () => {
  await dbConnect();
  const PORT = process.env.PORT || 5500;
  app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
  });
};

init();

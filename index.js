import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import salesforceRoute from "./route/salesforceRoute.js";
import userRoute from "./route/userRoute.js";
import { dbConnect } from "./config/dbConfig.js";
import { deleteBlacklistedJwts } from "./service/job/scheduledJobs.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/users", userRoute);
app.use("/sf", salesforceRoute);

const init = async () => {
  deleteBlacklistedJwts();
  await dbConnect();
  const PORT = process.env.PORT || 5500;
  app.listen(PORT, () => {
    console.log(`Server is listening on PORT: ${PORT}`);
  });
};

init();

import { Sequelize } from "sequelize";
import userModel from "../models/user.js";
import { sfDetailModel } from "../models/sfDetail.js";

let User = null;
let SfDetail = null;
export const dbConnect = async () => {
  const sequelize = new Sequelize(
    process.env.db_name,
    process.env.db_username,
    process.env.db_password,
    {
      host: process.env.ENV === "DEV" ? "localhost" : process.env.REMOTE_DB_URL,
      dialect: "postgres",
    }
  );

  try {
    await sequelize.authenticate();
    console.log(
      "Connection with PostgreSQL has been established successfully."
    );
    User = userModel(sequelize);
    SfDetail = sfDetailModel(sequelize);
    await sequelize.sync();
    console.log(`Tables created/updated successfully`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { User, SfDetail };

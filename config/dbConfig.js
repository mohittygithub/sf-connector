import { Sequelize } from "sequelize";
import userModel from "../model/user.js";
import sfDetailModel from "../model/sfDetail.js";
import blackListedJwtModel from "../model/blackListedJwt.js";

let User = null;
let SfDetail = null;
let BlackListedJwt = null;
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
    BlackListedJwt = blackListedJwtModel(sequelize);
    await sequelize.sync();
    console.log(`Tables created/updated successfully`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export { User, SfDetail, BlackListedJwt };

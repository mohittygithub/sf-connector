import { BlackListedJwt } from "../../config/dbConfig.js";

export const deleteBlacklistedJwts = () => {
  setInterval(async () => {
    await BlackListedJwt.destroy({
      where: {},
      truncate: true,
    });
    console.log("**** Delete Blacklisted Jwts Job ****");
  }, 3600000);
};

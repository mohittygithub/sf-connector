import { BlackListedJwt, JobDetail } from "../../config/dbConfig.js";

export const deleteBlacklistedJwts = () => {
  const startedAt = new Date();

  setInterval(async () => {
    console.log("**** Delete Blacklisted Jwts Job ****");
    const jwts = await BlackListedJwt.findAll();
    await BlackListedJwt.destroy({
      where: {},
      truncate: true,
    });

    console.log(`**** Deleted ${jwts.length} blacklisted JWT's ****`);

    const completedAt = new Date();

    await JobDetail.build({
      job_name: "Delete Blacklisted Jwts",
      startedAt,
      completedAt,
    });
  }, 3600000);
};

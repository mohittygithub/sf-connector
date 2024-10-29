import { Sequelize } from "sequelize";

const jobDetailModel = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "jobDetail",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      job_name: { type: DataTypes.TEXT, allowNull: false },
      startedAt: { type: DataTypes.DATE, allowNull: false },
      completedAt: { type: DataTypes.DATE, allowNull: false },
    },
    {
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );
};

export default jobDetailModel;

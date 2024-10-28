import { Sequelize } from "sequelize";

const blackListedJwtModel = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "blackListedJwt",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      jwt: { type: DataTypes.TEXT, allowNull: false },
    },
    {
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );
};

export default blackListedJwtModel;

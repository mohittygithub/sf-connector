import { Sequelize } from "sequelize";

export const sfDetailModel = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "sfDetail",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      client_id: { type: DataTypes.TEXT, allowNull: false },
      client_secret: { type: DataTypes.TEXT, allowNull: false },
      sf_org_id: { type: DataTypes.TEXT },
      redirect_uri: { type: DataTypes.TEXT },
      instance_url: { type: DataTypes.TEXT },
      access_token: { type: DataTypes.TEXT },
      refresh_token: { type: DataTypes.TEXT },
      api_version: { type: DataTypes.TEXT },
      grant_type: { type: DataTypes.TEXT },
    },
    {
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );
};

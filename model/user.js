import { Sequelize } from "sequelize";

const roles = ["ADMIN", "USER"];

const userModel = (sequelize) => {
  const { DataTypes } = Sequelize;

  return sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      first_name: { type: DataTypes.TEXT, allowNull: false },
      last_name: { type: DataTypes.TEXT, allowNull: false },
      email: { type: DataTypes.TEXT, allowNull: false, unique: true },
      password: { type: DataTypes.TEXT },
      role: { type: DataTypes.TEXT, allowNull: false, defaultValue: "USER" },
      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      sf_org_id: { type: DataTypes.TEXT },
    },
    {
      timestamps: true,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    }
  );
};

export default userModel;

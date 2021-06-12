"use strict";
module.exports = (sequelize, DataTypes) => {
    const groupmember = sequelize.define("groupmember", {
        groupId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        status: DataTypes.ENUM("Pending", "Approved", "Banned"),
    },
        { freezeTableName: true }
    );
    groupmember.associate = function (models) {
        groupmember.belongsTo(models.group, { foreignKey: "groupId" });
        groupmember.belongsTo(models.user, { foreignKey: "userId" });
    };
    return groupmember;
};

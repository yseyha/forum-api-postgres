"use strict";
module.exports = (sequelize, DataTypes) => {
    const reply = sequelize.define("reply", {
        topicId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        description: DataTypes.TEXT,
        banned: DataTypes.BOOLEAN
    },
        { freezeTableName: true }
    );
    reply.associate = function (models) {
        reply.belongsTo(models.topic, { foreignKey: "topicId" });
        reply.belongsTo(models.user, { foreignKey: "userId" });
    };
    return reply;
};


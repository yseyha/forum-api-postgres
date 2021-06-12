"use strict";
module.exports = (sequelize, DataTypes) => {
    const topic = sequelize.define("topic", {
        groupId: DataTypes.INTEGER,
        userId: DataTypes.INTEGER,
        title: DataTypes.STRING,
        description: DataTypes.TEXT,
        type: DataTypes.ENUM("Help", "Ideas", "Annoucement"),
        banned: DataTypes.BOOLEAN
    },
        { freezeTableName: true }
    );
    topic.associate = function (models) {
        topic.belongsTo(models.group, { foreignKey: "groupId" });
        topic.belongsTo(models.user, { foreignKey: "userId" });

        topic.hasMany(models.reply, { foreignKey: "topicId" , onDelete: "CASCADE" });
    };
    return topic;
};


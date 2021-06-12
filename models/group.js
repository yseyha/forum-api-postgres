"use strict";
module.exports = (sequelize, DataTypes) => {
    const group = sequelize.define("group", {
        userId: DataTypes.INTEGER,
        name: {
            type: DataTypes.STRING,
            set: function(val) {
                this.setDataValue('name', val.trim());
            }
        },
        description: DataTypes.TEXT,
        type: DataTypes.ENUM("Private", "Public"),
        banned: DataTypes.BOOLEAN
    },
        { freezeTableName: true }
    );
    group.associate = function (models) {
        group.belongsTo(models.user, { foreignKey: "userId" });
        group.hasMany(models.topic, { foreignKey: "groupId" , onDelete: "CASCADE" });
    };
    return group;
};

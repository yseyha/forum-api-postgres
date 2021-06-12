"use strict";
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define("user", {
        name: {
            type: DataTypes.STRING,
            set: function(val) {
                this.setDataValue('name', val.trim());
            }
        },
        email: {
            type: DataTypes.STRING,
            validate: { isEmail: true },
            unique: {
                args: true,
                msg: 'Email address already in use!'
            },
            set: function(val) {
                this.setDataValue('email', val.trim());
            }
        },
        password: DataTypes.STRING,
        role: DataTypes.ENUM('Admin', 'Member'),
        banned: DataTypes.BOOLEAN
    },
        {
            freezeTableName: true,
            // defaultScope: {
            //     attributes: { exclude: ['password'] }
            // },
            hooks: {
                beforeCreate: async (user) => {
                    if (user.password) {
                        const salt = await bcrypt.genSaltSync(10, 'a');
                        user.password = bcrypt.hashSync(user.password, salt);
                    }
                },
                beforeUpdate: async (user) => {
                    if (user.password) {
                        const salt = await bcrypt.genSaltSync(10, 'a');
                        user.password = bcrypt.hashSync(user.password, salt);
                    }
                },
                afterCreate: (record) => {
                    delete record.dataValues.password;
                },
                afterUpdate: (record) => {
                    delete record.dataValues.password;
                },
            },
            instanceMethods: {
                // validPassword: (password) => {
                //     return bcrypt.compareSync(password, this.password);
                // }
            }
        }
    );
    user.associate = function (models) {
        user.hasMany(models.group, { foreignKey: "userId", onDelete: "CASCADE" });
        user.hasMany(models.groupmember, { foreignKey: "userId", onDelete: "CASCADE" });
        user.hasMany(models.topic, { foreignKey: "userId", onDelete: "CASCADE" });
        user.hasMany(models.reply, { foreignKey: "userId", onDelete: "CASCADE" });
    };
    // user.prototype.validPassword = async (password, hash) => {
    //     // return await bcrypt.compareSync(password, hash);
    //     return await bcrypt.compareSync(password, hash);
    // }

    return user;
};

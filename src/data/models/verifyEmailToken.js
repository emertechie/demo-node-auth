module.exports = function(sequelize, DataTypes) {

    return sequelize.define("VerifyEmailToken", {
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        userId: { type: DataTypes.STRING, unique: true, allowNull: false },
        hashedToken: { type: DataTypes.STRING, allowNull: false }
    });
};
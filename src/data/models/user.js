module.exports = function(sequelize, DataTypes) {

    return sequelize.define("User", {
        id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
        username: { type: DataTypes.STRING, unique: true },
        email: { type: DataTypes.STRING, unique: true, allowNull: false },
        emailVerified: { type: DataTypes.BOOLEAN },
        hashedPassword: { type: DataTypes.STRING, allowNull: false },
        failedLoginAttempts: { type: DataTypes.INTEGER },
        lockedUntil: { type: DataTypes.DATE }
    });
};
var db = require('../data/database'),
    User = db.models.User,
    logging = require('../logging'),
    logger = logging.createLogger('user-store');

module.exports = {
    get: function(userId, cb) {
        logger.debug('Finding user with ID %s', userId);

        User.find(userId).then(function(user) {
            cb(null, user ? user.dataValues : null);
        }, function(err) {
            logger.error(err, 'Error getting user %s', userId);
            cb(err);
        });
    },
    add: function(userDetails, callback) {
        logger.debug('Adding user %s', userDetails.email);

        var user = User.build(userDetails);
        user.save().then(function(saved) {
            logger.info('Saved user %s with ID %d', userDetails.email, saved.dataValues.id);
            callback(null, false, saved.dataValues);
        }, function(err) {
            var userAlreadyExists = err.name === 'SequelizeUniqueConstraintError';
            if (userAlreadyExists) {
                logger.info(err, 'Record for user %s already exists', userDetails.email);
            } else {
                logger.error(err, 'Error saving user %s', userDetails.email);
            }
            callback(err, userAlreadyExists);
        });
    },
    update: function(user, callback) {
        logger.debug('Updating user %s', user.email);

        var updatableProps = {
            emailVerified: user.emailVerified,
            hashedPassword: user.hashedPassword,
            failedLoginAttempts: user.failedLoginAttempts,
            lockedUntil: user.lockedUntil
        };

        User.update(updatableProps, {
            where: { id: user.id }
        }).then(function(updated) {
            logger.debug('Updated user with email %s', user.email);
            callback(null, updated.dataValues);
        }, function(err) {
            logger.error(err, 'Error updating user %s', user.email);
            callback(err);
        });
    },
    remove: function(userId, callback) {
        logger.debug('Updating user with ID %s', userId);

        User.destroy({
            id: userId
        }).then(function(affectedRows) {
            logger.debug('Deleted %d user rows for userId %s', affectedRows, userId);
            callback(null);
        }, function(err) {
            logger.error(err, 'Error deleting user with ID %s', userId);
            callback(err);
        });
    },
    findByEmail: function(email, callback) {
        logger.debug('Finding user with %s', email);

        User.find({
            where: { email: email }
        }).then(function(user) {
            callback(null, user ? user.dataValues : null);
        }, function(err) {
            logger.error(err, 'Error finding user with email %s', email);
            cb(err);
        });
    }
};

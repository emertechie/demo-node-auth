var db = require('../data/database'),
    logging = require('../logging');

function createStoreObj(TokenStore, loggerName) {
    var logger = logging.createLogger(loggerName);

    return {
        add: function(tokenDetails, callback) {
            logger.debug('Adding token for user %s', tokenDetails.email);

            var token = TokenStore.build(tokenDetails);
            token.save().then(function() {
                logger.debug('Saved verify email token for %s', tokenDetails.email);
                callback(null);
            }, function(err) {
                logger.error(err, 'Error saving verify email token for %s', tokenDetails.email);
                callback(err);
            });
        },
        removeAllByEmail: function(email, callback) {
            logger.debug('Removing token for user %s', email);

            TokenStore.destroy({
                email: email
            }).then(function(affectedRows) {
                logger.debug('Deleted %d existing token rows for email %s', affectedRows, email);
                callback(null);
            }, function(err) {
                logger.error(err, 'Error deleting tokens for email %s', email);
                callback(err);
            });
        },
        findByEmail: function(email, callback) {
            logger.debug('Finding token for user %s', email);

            TokenStore.find({
                where: { email: email }
            }).then(function(result) {
                callback(null, result ? results.dataValues : null);
            }, function(err) {
                logger.error(err, 'Error finding tokens for email %s', email);
                callback(err);
            });
        }
    };
}

module.exports = {
    passwordReset: createStoreObj(db.models.PasswordResetToken, 'password-reset-token'),
    verifyEmail: createStoreObj(db.models.VerifyEmailToken, 'verify-email-token')
};
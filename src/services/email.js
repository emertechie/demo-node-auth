var logging = require('../logging'),
    logger = logging.createLogger('fake-email-service');

module.exports = {
    sendRegistrationEmail: function(user, verifyQueryString, cb) {
        var msg = 'Pretending to send registration email to ' + user.email;
        if (verifyQueryString) {
            msg += '. To verify email, visit /verifyemail' + verifyQueryString;
        }
        logger.info(msg);
        cb(null);
    },
    sendForgotPasswordEmail: function(user, verifyQueryString, cb) {
        logger.info('Pretending to send password reset email to ' + user.email + ' with reset URL: /resetpassword' + verifyQueryString);
        cb(null);
    },
    sendForgotPasswordNotificationForUnregisteredEmail: function(email, cb) {
        logger.info('Pretending to send notification of password reset for unknown email ' + email);
        cb(null);
    },
    sendPasswordSuccessfullyResetEmail: function(user, cb) {
        logger.info('Pretending to send password reset email to ' + user.email);
        cb(null);
    },
    sendPasswordSuccessfullyChangedEmail: function(user, cb) {
        logger.info('Pretending to send password changed email to ' + user.email);
        cb(null);
    }
};
var express = require('express'),
    bodyParser = require('body-parser'),
    config = require('config'),
    logging = require('./logging'),
    jwt = require('jsonwebtoken'),
    // Services:
    userStore = require('./services/userStore'),
    tokenStore = require('./services/tokenStore'),
    emailService = require('./services/email'),
    // Main lib:
    localAuthFactory = require('express-local-auth');

var app = express(),
    port = process.env.PORT || 3000,
    logger = logging.createLogger('app'),
    signingSecret = config.get('jwtSigningSecret');

app.use(bodyParser.urlencoded());

function getUserId(user) {
    return user.id;
}

var services = {
    emailService: emailService,
    userStore: userStore,
    passwordResetTokenStore: tokenStore.passwordReset,
    verifyEmailTokenStore: tokenStore.verifyEmail,
    logger: logger,
    userIdGetter: getUserId
};

var minuteInMs = 1000 * 60;
var twentyMins = 20 * minuteInMs;
var twentySeconds = 20 * 1000; // TODO: Just for testing, obviously

var localAuth = localAuthFactory(app, services, {
    failedLoginsBeforeLockout: 3, // << TODO Low number just for testing
    accountLockedMs: twentySeconds,
    verifyEmail: true,
    useSessions: false,
    autoSendErrors: true
});

// ------------------------------------------------------------

function createJwtToken(user) {
    var payload = {
        userId: getUserId(user)
    };

    // TODO: Set expiresInMinutes & handle refreshing tokens
    return jwt.sign(payload, signingSecret);
}

app.post('/login', localAuth.login(), function(req, res) {
    logger.info('Logged in user %s successfully. Sending JWT token', req.user.email);
    res.status(200).send(createJwtToken(req.user));
});

app.post('/register', localAuth.register(), function(req, res) {
    logger.info('Registered user %s successfully', req.user.email);
    res.status(200).send(createJwtToken(req.user));
});

app.use(function(err, req, res, next) {
    logger.error(err);
    res.status(500).send('Something went wrong there');
});

app.listen(port);
console.info('Running on port', port);
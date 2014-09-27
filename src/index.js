var express = require('express'),
    bodyParser = require('body-parser'),
    config = require('config'),
    logging = require('./logging'),
    jwt = require('jsonwebtoken'),
    cors = require('cors'),
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

// Allowing access from all domains here. May want to restrict that with cors options
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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
// var accountLockedMs = 20 * minuteInMs;
var accountLockedMs = 30 * 1000; // TODO: Just for testing, obviously

var localAuth = localAuthFactory(app, services, {
    failedLoginsBeforeLockout: 3, // << TODO Low number just for testing
    accountLockedMs: accountLockedMs,
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

app.get('/', function(req, res) {
    res.send('Demo node auth app. Nothing to see here');
});

app.post('/login', localAuth.login(), function(req, res) {
    logger.info('Logged in user %s successfully. Sending JWT token', req.user.email);
    res.status(200).send(createJwtToken(req.user));
});

// Note: logout handler is redundant now but would be used for
// token invalidation / marking user logged out in DB etc
app.get('/logout', localAuth.logout(), function(req, res) {
    logger.info('Logged out user successfully');
    res.status(200).send('Logged out successfully');
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
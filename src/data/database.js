var config = require('config'),
    databaseUrl = config.get('databaseUrl'),
    Sequelize = require("sequelize"),
    logging = require('../logging'),
    logger = logging.createLogger('database');

var match = databaseUrl.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
var user = match[1];
var password = match[2];
var host = match[3];
var port = match[4];
var dbName = match[5];

logger.info('Initializing Sequelize. Pointing to %s:%d/%s', host, port, dbName);
var sequelize = new Sequelize(dbName, user, password, {
    protocol: 'postgres',
    dialect: 'postgres',
    port: port,
    host: host,
    native: true
});

module.exports = {
    db: sequelize,
    models: {
        User: sequelize.import(__dirname + '/models/user'),
        VerifyEmailToken: sequelize.import(__dirname + '/models/verifyEmailToken'),
        PasswordResetToken: sequelize.import(__dirname + '/models/passwordResetToken')
    }
};

if (config.get('recreateDb')) {
    logger.debug('Dropping database');

    sequelize.drop().then(function () {
            createTables();
        }, function(err) {
            logger.error(err, 'Error dropping tables');
        });
} else {
    createTables();
}

function createTables() {
    logger.debug('Syncing database');

    sequelize.sync().then(function() {
            logger.info('Synced all tables');
        }, function(error) {
            logger.error(error, 'Error syncing tables');
        });
}


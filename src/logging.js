var bunyan = require('bunyan');

function SimpleLogger() {}
SimpleLogger.prototype.write = function (rec) {
    var nameFromLevel = {
        '10': 'TRACE',
        '20': 'DEBUG',
        '30': 'INFO',
        '40': 'WARN',
        '50': 'ERROR',
        '60': 'FATAL'
    };
    console.log('[%s] %s: %s %s', rec.time, nameFromLevel[rec.level], rec.msg, rec.err || '');
};

module.exports = {
    createLogger: function(name) {
        return bunyan.createLogger({
            name: name,
            level: 'debug',
            streams: [{
                level: 'debug',
                stream: new SimpleLogger(),
                type: 'raw'
            }]
        });
    }
};
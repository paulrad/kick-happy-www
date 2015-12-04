/**
 * KH/A
 * @author Paul Rad <paul@paulrad.com>
 * @homepage https://github.com/paulrad/kick-happy-api
 * @copyright 2015 Paul Rad
 * MIT Licence (MIT)
 */

require('./sys/kh.js');
require('./sys/logger.js');
require('./sys/hapi.js');
require('./sys/server.js');
require('./sys/helpers.js');
require('./sys/views.js');
require('./sys/routes.js');

process.on('uncaughtException', function(internalError) {
  console.error(internalError);
});

/* eslint-disable no-console */
require('dotenv').config();
import http from 'http';
import Debug from 'debug';
import { Application } from './app';

const debug = Debug('devdo-api');
const app = new Application().app;

const normalizePort = (val: any) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const server = http.createServer(app);
const port = normalizePort(process.env.PORT || '3000');

const onError = (error: any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  server.address();
  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
  debug(`Listening on ${bind}`);
};

app.set('port', port);

server.on('error', onError);
server.on('listening', onListening);

server.listen(app.get('port'), () =>
  console.log('    🤟 App is running at http://localhost:%d in %s mode', app.get('port'), app.get('env'))
);

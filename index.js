require ('dotenv-safe').config ({allowEmptyValues: true}) ;
const Middleware = require('./services/server.js');

//inicia a aplicacao
const server = new Middleware();
server.startup();

//SIGINT e SIGTERM estão relacionados a sinais que podem ser enviados ao processo 
//para desligá-lo, como quando ctrl + c é pressionado
process.on('SIGTERM', () => {
  console.log('Recebido SIGTERM');
  server.shutdown();
});

process.on('SIGINT', () => {
  console.log('Recebido SIGINT');
  server.shutdown();
});

//o evento uncaughtException ocorrerá quando um erro JavaScript for emitido
process.on('uncaughtException', err => {
  console.log('Uncaught exception');
  console.error(err);
  server.shutdown(err);
});
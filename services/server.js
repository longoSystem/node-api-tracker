const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const database = require('./database.js');
const router = require('./router.js');
const cors = require('cors');

module.exports = function () {

  //atributo privado usado para carregar as definicoes do middleware Express.
  var httpServer;

  //metodo privado responsavel por parametrizar o middleware Express.
  var initialize = function () {
    console.info('services/server :: method -> initialize');
    return new Promise((resolve, reject) => {
      const app = express();

      var corsOptions = {
        origin: [ "http://localhost:8081", "http://localhost:8080"]
      };
      
      app.use(cors(corsOptions));

      bodyParser.text({
        defaultCharset: "utf8"
      });

      app.use(bodyParser.urlencoded({
        extended: true
      }));

      app.use(bodyParser.json());
      //cria a camada de log da API
      app.use(morgan('combined'));
      // cria o roteador para que todas resquisicoes comecem com '/api/v1'
      app.use('/api/v1', router);

      //Rota criada para testar a disponibilidade do servico.
      app.get('/', (req, res) => {
        res.end('API Tracker - Initializing [ version 0.0.1 ] ... ');
      });

      //Rota criada para testar o pool de conexoes com o banco de dados oracle.
      app.get('/status-db', async (req, res) => {
        console.info('services/server :: method -> app.get');
        const client = await pool.connect();
        try {

          await client.query(`SELECT NOW()`);
        } catch (error) {
          console.error(error);
        } finally {
          client.rel
        }
        //const result = await client.executeQuery('select user, systimestamp from dual');
        //const user = result.rows[0].USER;
        //const date = result.rows[0].SYSTIMESTAMP;
        //res.end(`DB user: ${user}\nDate: ${date}`);
      });

      httpServer = http.createServer(app);
      httpServer.listen(process.env.PORT)
        .on('listening', () => {
          console.log(`Escuta do servidor Web em: localhost: ${process.env.PORT}`);
          resolve();
        })
        .on('error', err => {
          reject(err);
        });
    });
  }

  //metodo privado responsavel finalizar o middleware Express.
  var finalize = function () {
    console.info('services/server :: method -> finalize');
    return new Promise((resolve, reject) => {
      httpServer.close((err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  }

  //metodo publico: responsavel por inicializar o servico da API.
  this.startup = async function () {
    console.log('Iniciando - API Tracker ...');
    try {
      console.log('Iniciando o servidor de recursos da API Tracker.');
      await initialize();
      //console.log('Iniciando Pool de conexao Oracle database.');
      //await database.initialize();
    } catch (err) {
      console.error(err);
      process.exit(1); // Non-zero failure code
    }
  }

  // metodo publico: responsavel por finalizar o servico da API.
  this.shutdown = async function (e) {
    let err = e;
    try {
      //console.log('Desligando Pool de conexao Oracle database.');
      //await database.close();
      console.log('Desligando o servidor de recursos da API Tracker.');
      await finalize();
    } catch (e) {
      console.error('Um erro foi encontrado:', e);
      err = err || e;
    }
    console.log('Encerrando o processo ...');
    if (err) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  }

}
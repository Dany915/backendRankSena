const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/api/curso';

        //conexion a bd
        this.conectarBD();

        //Middlewares
        this.middlewares();

        this.routes();
    }

    async conectarBD(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use( express.json() );

        //Direcctorio publico
        // this.app.use(express.static('public'));
    }

    routes(){
        this.app.use(this.userPath, require('../routes/curso'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
            
        });
    }
}

module.exports = Server;
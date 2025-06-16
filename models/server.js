const express = require('express')
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.userPath = '/api/usuario';
        this.cursoPath = '/api/curso';
        this.estudiantePath = '/api/estudiante';
        this.actividadPath = '/api/actividad';
        this.notaPath = '/api/nota';
        this.programaPath = '/api/programa';
        // this.competenciaPath = '/api/competencia';
        // this.rAprendizajePath = '/api/ra';

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
        this.app.use(this.userPath, require('../routes/usuario'));
        this.app.use(this.cursoPath, require('../routes/curso'));
        this.app.use(this.estudiantePath, require('../routes/estudiante'));
        this.app.use(this.actividadPath, require('../routes/actividad'));
        this.app.use(this.notaPath, require('../routes/nota'));
        this.app.use(this.programaPath, require('../routes/programa'));
        // this.app.use(this.competenciaPath, require('../routes/competencia'));
        // this.app.use(this.rAprendizajePath, require('../routes/ra'));
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en puerto ', this.port);
            
        });
    }
}

module.exports = Server;
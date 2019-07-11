var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
//expotando el seed
var SEED = require('../config/config').SEED;

var app = express();

var Persona = require('../models/persona');

//===========================================================================
//                 AUTENTICACION NORMAL
//===========================================================================

app.post('/', (req, res) => {

    var body = req.body;

    //busqueda el correo
    Persona.findOne({ email: body.email }, (err, personaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                error: err
            });
        }

        if (!personaDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'creadenciales incorrectas - email',
                error: err
            });
        }

        //verificacion de password (solo devuelbe un true o false)
        if (!bcrypt.compareSync(body.password, personaDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'creadenciales incorrectas - password',
                error: err
            });
        }


        //CREAR TOKEN !!
        var token = jwt.sign({ persona: personaDB }, SEED, { expiresIn: 14400 }); //4 horas


        res.status(200).json({
            ok: true,
            persona: personaDB,
            token: token,
            id: personaDB._id
        });

    });


});


//===========================================================================
//                  MENU
//===========================================================================

function obtenerMenu(rol) {

    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'Graficas', url: '/graficas1' }
            ]
        },
        {
            titulo: 'Mantenimiento',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                { titulo: 'Usuarios', url: '/usuarios' },
                //{ titulo: 'Medicos', url: '/medicos' }
            ]
        }
    ];

    /* if (rol === 'ADMINISTRADOR') {
        menu[1].submenu.unshift({ titulo: 'Medicos', url: '/medicos' });
    } */


    return menu;

}



module.exports = app;
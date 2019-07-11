var express = require('express');
var bcrypt = require('bcryptjs'); //libreria para la incriptacion
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middleeares/autenticacion');

var app = express();

var Persona = require('../models/persona');
var Fecha = require('../models/fecha');


//===========================================================================
//                 OBTENER TODAS LAS PERSONAS CON FECHAS
//===========================================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Persona.find({})
        .skip(desde) //permite saltarse los 10 priperos registros y ver los 5 siguientes
        .limit(10) //limite re dejistros que se mostraran
        .populate('fechas')
        .exec(

            (err, personas) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error cargando personas',
                        errors: err
                    });
                }

                Persona.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        personas,
                        total: conteo
                    });

                });

            });
});



//===========================================================================
//                 ACTUALIZAR PERSONA
//===========================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por el id
    Persona.findById(id, (err, persona) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar persona',
                errors: err
            });
        }

        if (!persona) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la persona con el id' + id + 'no existe',
                errors: { message: 'no existe una persona con ese id' }
            });
        }

        persona.DNIPer = body.DNIPer;
        persona.nombrePer = body.nombrePer;
        persona.apPaternoPer = body.apPaternoPer;
        persona.apMaternoPer = body.apMaternoPer;
        persona.telefonoPer = body.telefonoPer;
        persona.rol = body.rol;


        persona.save((err, personaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actializar persona',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                persona: personaGuardado,
                personaToken: req.persona
            });

        });

    })

});


//===========================================================================
//                 ACTUALIZAR FECHA
//===========================================================================

app.put('/fechas/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id
    Persona.findById(id, (err, persona) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar persona',
                errors: err
            });
        }

        if (!carrera) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la persona con el id' + id + 'no existe',
                errors: { message: 'no existe una persona con ese id' }
            });
        }

        console.log(persona);

    });


});



//===========================================================================
//                 CREAR UN NUEVA PERSONA  
//===========================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    //creacion de las fechas
    var fechas = new Fecha({
        fechInicioPer: body.fechInicioPer,
        fechFinPer: body.fechFinPer
    });

    fechas.save((err, fechaGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear fechas',
                errors: err
            });
        }

        var persona = new Persona({
            DNIPer: body.DNIPer,
            nombrePer: body.nombrePer,
            apPaternoPer: body.apPaternoPer,
            apMaternoPer: body.apMaternoPer,
            telefonoPer: body.telefonoPer,
            password: bcrypt.hashSync(body.password, 10), //incriptancion de password
            email: body.email,
            rol: body.rol,
            fechas: fechas._id
        });

        persona.save((err, peresonaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al crear persona',
                    errors: err
                });
            }


            res.status(201).json({
                ok: true,
                pesona: peresonaGuardado,
                fechaGuardado,
                personaToken: req.persona
            });

        });

    });

});




//===========================================================================
//                 ACTIVAR Y DESACTIVAR UN USUARIO POR EL ID  
//===========================================================================

app.put('/delete/:id', (req, res) => {

    var id = req.params.id;

    //busacando en la base de datos por  el id  
    Persona.findById(id, (err, persona) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar usuario',
                errors: err
            });
        }

        if (persona.estado === true) {

            persona.estado = false;

            persona.save((err, personaDesactivada) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al desactivar usuario',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    persona: personaDesactivada
                });

            });

        } else {

            persona.estado = true;

            persona.save((err, personaActiva) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al activar usuario',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    persona: personaActiva
                });

            });

        }



    });

});





module.exports = app;
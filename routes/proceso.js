var express = require('express');

var mdAutenticacion = require('../middleeares/autenticacion');

var app = express();

var Proceso = require('../models/proceso');




//===========================================================================
//                 OBTENER TODOS LOS PROCESOS 
//===========================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Proceso.find({})
        .skip(desde)
        .limit(10)
        .exec(

            (err, procesos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error cargando proceso',
                        errors: err
                    });
                }

                Proceso.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        procesos,
                        total: conteo
                    });

                });
            });
});


//===========================================================================
//                 OBTENER UN PROCESO
//===========================================================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Proceso.findById(id, (err, proceso) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar proceso',
                errors: err
            });
        }

        if (!proceso) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el proceso con el id' + id + 'no existe',
                errors: { message: 'no existe un proceso con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            proceso: proceso
        });

    });

});


//===========================================================================
//                 ACTUALIZAR PROCESO
//===========================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id 
    Proceso.findById(id, (err, proceso) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar proceso',
                errors: err
            });
        }

        if (!proceso) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el proceso con el id' + id + 'no existe',
                errors: { message: 'no existe un proceso con ese id' }
            });
        }


        proceso.proceso = body.proceso;

        proceso.save((err, procesoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actializar proceso',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                proceso: procesoGuardado
            });

        });

    });

});



//===========================================================================
//                 CREAR UN NUEVO PROCESO  
//===========================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var proceso = new Proceso({
        proceso: body.proceso
    });

    proceso.save((err, procesoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear proceso',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            proceso: procesoGuardado
        });

    });

});





//===========================================================================
//                 ACTIVAR Y DESACTIVAR UN PROCESO POR EL ID  
//===========================================================================

app.put('/delete/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id 
    Proceso.findById(id, (err, proceso) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar proceso',
                errors: err
            });
        }

        if (!proceso) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el proceso con el id' + id + 'no existe',
                errors: { message: 'no existe un proceso con ese id' }
            });
        }

        if (proceso.estadoPro === true) {

            proceso.estadoPro = false;

            proceso.save((err, procesoDesactivado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al desactivar proceso',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    proceso: procesoDesactivado
                });

            });

        } else {

            proceso.estadoPro = true;

            proceso.save((err, procesoActivado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al activar proceso',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    proceso: procesoActivado
                });

            });

        }




    });

});






module.exports = app;
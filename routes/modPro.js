var express = require('express');
var bcrypt = require('bcryptjs'); //libreria para la incriptacion
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middleeares/autenticacion');

var app = express();

var ModPro = require('../models/modPro');
var Modalidad = require('../models/modalidad');


//===========================================================================
//                 OBTENER TODOS LAS MODALIDADES PROCESOS
//===========================================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    ModPro.find({})
        .skip(desde)
        .limit(10)
        .populate('proceso')
        .exec(

            (err, modPro) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error cargando modalidad proceso',
                        errors: err
                    });
                }

                ModPro.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        modPro,
                        total: conteo
                    });

                });

            });

});



//===========================================================================
//                 OBTENER UNA MODALIDAD PROCESO
//===========================================================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    ModPro.findById(id, (err, modPro) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar modalidad proceso',
                errors: err
            });
        }

        if (!modPro) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la modalidad proceso con el id' + id + 'no existe',
                errors: { message: 'no existe una modalidad proceso con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            modPro: modPro
        });

    });

});


//===========================================================================
//                 ACTUALIZAR UN NUEVA MODALIDAD PROCESO  
//===========================================================================
app.put('/:id', mdAutenticacion.verificaToken, async(req, res) => {

    var id = req.params.id;
    var body = req.body;


    var idM = body.modalidad;

    let modalidad = await Modalidad.findById(idM);
    var nombreMod = modalidad.modalidad

    //busacando en la base de datos por  el id 
    ModPro.findById(id, (err, modPro) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar modalidad proceso',
                errors: err
            });
        }

        if (!modPro) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la modalidad proceso con el id' + id + 'no existe',
                errors: { message: 'no existe una modalidad proceso con ese id' }
            });
        }

        modPro.fechInicioMP = body.fechInicioMP,
            modPro.fechFinMP = body.fechFinMP,
            modPro.proceso = body.proceso,
            modPro.modalidad = body.modalidad,
            modPro.nombreMod = nombreMod

        modPro.save((err, modProGuardados) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actializar modalidad proceso',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                modPro: modProGuardados
            });

        });

    });


})

//===========================================================================
//                 CREAR UN NUEVA MODALIDAD PROCESO  
//===========================================================================

app.post('/', mdAutenticacion.verificaToken, async(req, res) => {

    var body = req.body;
    var idM = body.modalidad;


    let modalidad = await Modalidad.findById(idM);
    var nombreMod = modalidad.modalidad;

    var modPro = new ModPro({
        fechInicioMP: body.fechInicioMP,
        fechFinMP: body.fechFinMP,
        proceso: body.proceso,
        modalidad: body.modalidad,
        nombreMod: nombreMod
    });

    modPro.save((err, modProGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear modalidad proceso',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            modPro: modProGuardado
        });

    });

});



//===========================================================================
//                 ACTIVAR Y DESACTIVAR UNA MODALIDAD POR EL ID  
//===========================================================================

app.put('/delete/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    ModPro.findById(id, (err, modPro) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar modalidad proceso',
                errors: err
            });
        }

        if (!modPro) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la modalidad proceso con el id' + id + 'no existe',
                errors: { message: 'no existe una modalidad proceso con ese id' }
            });
        }


        if (modPro.estadoMP === true) {

            modPro.estadoMP = false;

            modPro.save((err, modProDesactivada) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al desactivar modalidad proceso',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    modPro: modProDesactivada
                });

            });

        } else {

            modPro.estadoMP = true;

            modPro.save((err, modProActivada) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al activar modalidad proceso',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    modPro: modProActivada
                });

            });

        }




    });

});

module.exports = app;
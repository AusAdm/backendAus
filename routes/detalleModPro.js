var express = require('express');
var bcrypt = require('bcryptjs'); //libreria para la incriptacion
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middleeares/autenticacion');

var app = express()

var DetallerModPro = require('../models/detalleModPro');
var Carrera = require('../models/carrera');



//===========================================================================
//                 OBTENER TODOS LAS MODALIDADES PROCESOS
//===========================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    DetallerModPro.find({})
        .skip(desde)
        .limit(10)
        .populate('modPro')
        .populate({ path: 'carreras', populate: { path: 'carreras' } })
        .exec(

            (err, detalleMP) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error cargando detalle modalidad proceso',
                        errors: err
                    });
                }

                DetallerModPro.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        detalleMP,
                        total: conteo
                    });

                });

            });

})


//===========================================================================
//                 OBTENER UN DETALLE MODALIDAD PROCESO
//===========================================================================

app.get('/:id', (req, res) => {
    var id = req.params.id;

    DetallerModPro.findById(id, {})
        .populate({ path: 'carreras', populate: { path: 'carreras' } })
        .populate('modPro')
        .exec((err, detalleMP) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al buscar detalle modalidad proceso',
                    errors: err
                });
            }

            if (!detalleMP) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'el detalle modalidad proceso con el id' + id + 'no existe',
                    errors: { message: 'no existe un detalle modalidad proceso con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                detalleMP: detalleMP
            });

        });
});




//===========================================================================
//                 ACTUALIZAR DETALLE MODALIDAD PROCESO 
//===========================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id 
    DetallerModPro.findById(id, (err, detalleMP) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar detalle modalidad proceso',
                errors: err
            });
        }

        if (!detalleMP) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el detalle modalidad proceso con el id' + id + 'no existe',
                errors: { message: 'no existe un detalle modalidad proceso con ese id' }
            });
        }

        detalleMP.nombreCar = body.nombreCar;
        detalleMP.carreras = body.carreras;
        detalleMP.modPro = body.modPro;

        detalleMP.save((err, detalleMPGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actializar detalle modalidad proceso',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                detalleMP: detalleMPGuardado
            });

        });

    });
});




//===========================================================================
//                 CREAR UN NUEVO DETALLE MODALIDAD PROCESO  
//===========================================================================

app.post('/', mdAutenticacion.verificaToken, async(req, res) => {

    var body = req.body;

    var detalleMP = new DetallerModPro({
        nombreCar: body.nombreCar,
        carreras: body.carreras,
        modPro: body.modPro
    })

    detalleMP.save((err, detalleMPGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear detalle modalidad proceso',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            detalleMP: detalleMPGuardado
        });

    })

})



//===========================================================================
//                 ACTIVAR Y DESACTIVAR UNA CARRERA POR EL ID  
//===========================================================================

app.put('/delete/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id 
    DetallerModPro.findById(id, (err, detalleMP) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar detalle modalidad proceso',
                errors: err
            });
        }

        if (!detalleMP) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el detalle modalidad proceso con el id' + id + 'no existe',
                errors: { message: 'no existe un detalle modalidad proceso con ese id' }
            });
        }

        if (detalleMP.estadoDMP === true) {

            detalleMP.estadoDMP = false;

            detalleMP.save((err, detalleMPDesactivado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al desactivar detalle modalidad proceso',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    detalleMP: detalleMPDesactivado
                });

            });
        } else {

            detalleMP.estadoDMP = true;

            detalleMP.save((err, detalleMPActivado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al activar detalle modalidad proceso',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    detalleMP: detalleMPActivado
                });

            });

        }

    });
});


module.exports = app;
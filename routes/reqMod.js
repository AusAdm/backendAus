var express = require('express');
var bcrypt = require('bcryptjs'); //libreria para la incriptacion
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middleeares/autenticacion');

var app = express()

var ReqMod = require('../models/reqMod');


//===========================================================================
//                 OBTENER TODOS LOS REQUISITO MODALIDAD
//===========================================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    ReqMod.find({})
        .skip(desde)
        .limit(10)
        .populate({ path: 'requisitos', populate: { path: 'requisitos' } })
        .populate('modalidad', 'modalidad')
        .exec(

            (err, reqMod) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error cargando reqisito modalidad',
                        errors: err
                    });
                }

                ReqMod.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        reqMod,
                        total: conteo
                    });
                });

            });
});


//===========================================================================
//                 OBTENER UN REQUISITO MODALIDAD
//===========================================================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    ReqMod.findById(id, {})
        .populate({ path: 'requisitos', populate: { path: 'requisitos' } })
        .populate('modalidad', 'modalidad')
        .exec((err, reqMod) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'error al buscar requisito modalidad',
                    errors: err
                });
            }

            if (!reqMod) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'el requisito modalidad con el id' + id + 'no existe',
                    errors: { message: 'no existe un requisito modalidad con ese id' }
                });
            }

            res.status(200).json({
                ok: true,
                reqMod: reqMod
            });

        })

});



//===========================================================================
//                 ACTUALIZAR DETALLE MODALIDAD PROCESO 
//===========================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id 

    ReqMod.findById(id, (err, reqMod) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar requisito modalidad',
                errors: err
            });
        }


        if (!reqMod) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el requisito modalidad con el id' + id + 'no existe',
                errors: { message: 'no existe un requisito modalidad con ese id' }
            });
        }

        reqMod.requisitos = body.requisitos;
        reqMod.modalidad = body.modalidad;

        reqMod.save((err, reqModGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actializar requisito modalidad',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                reqMod: reqModGuardado
            });

        });

    });
});



//===========================================================================
//                 CREAR UN NUEVO REQUISITO MODALIDAD 
//===========================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var reqMod = new ReqMod({
        modalidad: body.modalidad,
        requisitos: body.requisitos
    })

    reqMod.save((err, reqModGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear requisito modalidad',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            reqMod: reqModGuardado
        });

    })
});



//===========================================================================
//                 ACTIVAR Y DESACTIVAR UN REQUISITO MODALIDAD POR EL ID  
//===========================================================================

app.put('/delete/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id
    ReqMod.findById(id, (err, reqMod) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar requisito modalidad',
                errors: err
            });
        }

        if (!reqMod) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el requisito modalidad con el id' + id + 'no existe',
                errors: { message: 'no existe un requisito modalidad con ese id' }
            });
        }

        if (reqMod.estadoRM === true) {

            reqMod.estadoRM = false;

            reqMod.save((err, reqModDesactivar) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al desactivar requisito modalidad',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    reqMod: reqModDesactivar
                });

            });

        } else {

            reqMod.estadoRM = true;

            reqMod.save((err, reqModActivar) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al activar requisito modalidad',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    reqMod: reqModActivar
                });

            });

        }

    });
});



module.exports = app;
var express = require('express');

var mdAutenticacion = require('../middleeares/autenticacion');

var app = express();

var Modalidad = require('../models/modalidad');




//===========================================================================
//                 OBTENER TODOS LAS MODALIDADES 
//===========================================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Modalidad.find({})
        .skip(desde)
        .limit(10)
        .exec(

            (err, modalidades) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error cargando modalidad',
                        errors: err
                    });
                }

                Modalidad.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        modalidades,
                        total: conteo
                    });

                });
            });
});



//===========================================================================
//                 OBTENER UNA MODALIDAD
//===========================================================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Modalidad.findById(id, (err, modalidad) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar modalidad',
                errors: err
            });
        }

        if (!modalidad) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la modalidad con el id' + id + 'no existe',
                errors: { message: 'no existe una modalidad con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            modalidad: modalidad
        });

    });

});




//===========================================================================
//                 ACTUALIZAR MODALIDAD
//===========================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id 
    Modalidad.findById(id, (err, modalidad) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar modalidad',
                errors: err
            });
        }

        if (!modalidad) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la modalidad con el id' + id + 'no existe',
                errors: { message: 'no existe una modalidad con ese id' }
            });
        }


        modalidad.modalidad = body.modalidad;

        modalidad.save((err, modalidadGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actializar modalidad',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                modalidad: modalidadGuardado
            });

        });

    });

});



//===========================================================================
//                 CREAR UN NUEVA MODALIDAD  
//===========================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var modalidad = new Modalidad({
        modalidad: body.modalidad
    });

    modalidad.save((err, modalidadGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear modalidad',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            modalidad: modalidadGuardado
        });

    });

});





//===========================================================================
//                 ACTIVAR Y DESACTIVAR UNA MODALIDAD POR EL ID  
//===========================================================================

app.put('/delete/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id  
    Modalidad.findById(id, (err, modalidad) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar modalidad',
                errors: err
            });
        }

        if (!modalidad) {
            return res.status(400).json({
                ok: false,
                mensaje: 'la modalidad con el id' + id + 'no existe',
                errors: { message: 'no existe una modalidad con ese id' }
            });
        }

        if (modalidad.estadoMod === true) {

            modalidad.estadoMod = false;

            modalidad.save((err, modalidadDesactivada) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al desactivar modalidad',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    modalidad: modalidadDesactivada
                });

            });

        } else {

            modalidad.estadoMod = true;

            modalidad.save((err, modalidadActivada) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al activar modalidad',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    modalidad: modalidadActivada
                });

            });

        }




    });

});






module.exports = app;
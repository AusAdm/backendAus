var express = require('express');

var mdAutenticacion = require('../middleeares/autenticacion');

var app = express();

var Requisito = require('../models/requisito');




//===========================================================================
//                 OBTENER TODOS LOS REQUISITOS 
//===========================================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Requisito.find({})
        .skip(desde)
        .limit(10)
        .exec(

            (err, requisitos) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error requisito rol',
                        errors: err
                    });
                }

                Requisito.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        requisitos,
                        total: conteo
                    });

                });

            });
});



//===========================================================================
//                 OBTENER UN REQUISITO
//===========================================================================

app.get('/:id', (req, res) => {

    var id = req.params.id;

    Requisito.findById(id, (err, requisito) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar requisito',
                errors: err
            });
        }

        if (!requisito) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el requisito con el id' + id + 'no existe',
                errors: { message: 'no existe un requisito con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            requisito: requisito
        });

    });

});



//===========================================================================
//                 ACTUALIZAR REQUISITO
//===========================================================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id 
    Requisito.findById(id, (err, requisito) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar requisito',
                errors: err
            });
        }

        if (!requisito) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el requisito con el id' + id + 'no existe',
                errors: { message: 'no existe un requisito con ese id' }
            });
        }


        requisito.requisito = body.requisito;

        requisito.save((err, requisitoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al actializar requisito',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                requisito: requisitoGuardado
            });

        });

    });

});



//===========================================================================
//                 CREAR UN NUEVO REQUISITO  
//===========================================================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {

    var body = req.body;

    var requisito = new Requisito({
        requisito: body.requisito
    });

    requisito.save((err, requisitoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear requisito',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            requisito: requisitoGuardado
        });

    });

});





//===========================================================================
//                 ACTIVAR Y DESACTIVAR UN REQUISITO POR EL ID  
//===========================================================================

app.put('/delete/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    //busacando en la base de datos por  el id  
    Requisito.findById(id, (err, requisito) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al buscar requisito',
                errors: err
            });
        }

        if (!requisito) {
            return res.status(400).json({
                ok: false,
                mensaje: 'el requisito con el id' + id + 'no existe',
                errors: { message: 'no existe un requisito con ese id' }
            });
        }

        if (requisito.estadoReq === true) {

            requisito.estadoReq = false;

            requisito.save((err, requisitoDesactivado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al desactivar requisito',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    requisito: requisitoDesactivado
                });

            });

        } else {

            requisito.estadoReq = true;

            requisito.save((err, requisitoActivado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al activar requisito',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    requisito: requisitoActivado
                });

            });

        }




    });

});






module.exports = app;
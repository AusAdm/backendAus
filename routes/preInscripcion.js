var express = require('express');
var mdAutenticacion = require('../middleeares/autenticacion');

var app = express();

var Apoderado = require('../models/apoderado');
var InfoAcademica = require('../models/infoAcademica');
var Postulante = require('../models/postulante');
var PreInscripcion = require('../models/preInscripcion');


//===========================================================================
//                 OBTENER TODAS LAS PRE INSCRIPCIONES
//===========================================================================

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    PreInscripcion.find({})
        .skip(desde)
        .limit(10)
        .populate('postulante')
        .populate({ path: 'postulante', populate: { path: 'apoderado' } })
        .populate({ path: 'postulante', populate: { path: 'infoAcademica' } })
        .exec(

            (err, preInscripcion) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'error cargando pre Inscripcion',
                        errors: err
                    });
                }

                PreInscripcion.countDocuments({}, (err, conteo) => {

                    res.status(200).json({
                        ok: true,
                        preInscripcion,
                        total: conteo
                    });

                });

            });
});

//===========================================================================
//                 CREAR UN NUEVA PRE INSCRIPCION  
//===========================================================================

app.post('/', (req, res) => {

    var body = req.body;

    //creacion del apoderado
    var apoderado = new Apoderado({
        tipoDocIdentidadApo: body.tipoDocIdentidadApo,
        numeroDocIdentidadApo: body.numeroDocIdentidadApo,
        nombreApo: body.nombreApo,
        apPaternoApo: body.apPaternoApo,
        apMaternoApo: body.apMaternoApo,
        fechaNaciApo: body.fechaNaciApo,
        edadApo: body.edadApo,
        sexoApo: body.sexoApo,
        direccionApo: body.direccionApo,
        telefonoApo: body.telefonoApo
    });

    apoderado.save((err, apoderadoGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'error al crear apoderado',
                errors: err
            });
        }

        //creacion de informacion academica 
        var infoAcademica = new InfoAcademica({
            tipoIE: body.tipoIE,
            nombreIE: body.nombreIE,
            añoEgreso: body.añoEgreso
        });

        infoAcademica.save((err, infoAcademicaGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al crear informacion academica',
                    errors: err
                });
            }

            //creacion del postulante
            var postulante = new Postulante({
                PaisOrigenPos: body.PaisOrigenPos,
                tipoDocIdentidadPos: body.tipoDocIdentidadPos,
                numeroDocIdentidadPos: body.numeroDocIdentidadPos,
                nombrePos: body.nombrePos,
                apPaternoPos: body.apPaternoPos,
                apMaternoPos: body.apMaternoPos,
                fechaNaciPos: body.fechaNaciPos,
                edadPos: body.edadPos,
                sexoPos: body.sexoPos,
                apoderado: apoderado._id,
                infoAcademica: infoAcademica._id
            });

            postulante.save((err, postulanteGuardado) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'error al crear postulante',
                        errors: err
                    });
                }

                //creacion de pre inscripcion
                preInscripcion = new PreInscripcion({
                    fechaHoraPre: body.fechaHoraPre,
                    departamentoPre: body.departamentoPre,
                    distritoPre: body.distritoPre,
                    provinciaPre: body.provinciaPre,
                    direccionPre: body.direccionPre,
                    estadoCivilPre: body.estadoCivilPre,
                    emailPre: body.emailPre,
                    telefonoPre: body.telefonoPre,
                    postulante: postulante._id
                });

                preInscripcion.save((err, preInscripcionGuardado) => {

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            mensaje: 'error al crear pre inscripcion',
                            errors: err
                        });
                    }

                    res.status(201).json({
                        ok: true,
                        preInscripcion: preInscripcionGuardado,
                        postulanteGuardado,
                        infoAcademicaGuardado,
                        apoderadoGuardado
                    });

                });

            });


        });

    });

});


module.exports = app;
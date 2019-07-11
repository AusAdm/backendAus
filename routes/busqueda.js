var express = require('express');

var app = express();

//matenimiento 
var Persona = require('../models/persona');
var Proceso = require('../models/proceso');
var Modalidad = require('../models/modalidad');
var Carrera = require('../models/carrera');
var Requisito = require('../models/requisito');

//===========================================================================
//                 BUSQUEDA POR COLLECTION 
//===========================================================================

app.get('/colleccion/:tabla/:busqueda', (req, res) => {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'personas':
            promesa = buscarPersonas(busqueda, regex);
            break;

        case 'procesos':
            promesa = buscarProcesos(busqueda, regex);
            break;

        case 'modalidades':
            promesa = buscarModalidades(busqueda, regex);
            break;

        case 'carreras':
            promesa = buscarCarreras(busqueda, regex);
            break;

        case 'requisitos':
            promesa = buscarRequisitos(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda son: usuarios, procesos, modalidades, carreras, requisitos',
                error: { message: 'Tipo de tabla/coleccion no valido' }
            });
    }

    promesa.then(data => {

        res.status(200).json({
            ok: true,
            [tabla]: data
        });

    })

});

//===========================================================================
//                 BUSQUEDA GENERAL
//===========================================================================

app.get('/todo/:busqueda', (req, res, next) => {

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    //manejo del arreglo de promesas 
    //(si hay un error en cualquiera de las promesas se detentra la ejecucion y se mandara el err)
    Promise.all([
            buscarPersonas(busqueda, regex),
            buscarProcesos(busqueda, regex),
            buscarModalidades(busqueda, regex),
            buscarCarreras(busqueda, regex),
            buscarRequisitos(busqueda, regex)
        ])
        .then(respuesta => {

            res.status(200).json({
                ok: true,
                personas: respuesta[0],
                procesos: respuesta[1],
                modalidades: respuesta[2],
                carreras: respuesta[3],
                requisitos: respuesta[4]
            });

        });

});

//bsuqueda en 2 columnas de una collection
function buscarPersonas(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Persona.find({}, 'DNIPer nombrePer apPaternoPer apMaternoPer rol estado email telefonoPer img')
            .or([
                //{ 'DNIPer': regex },
                { 'nombrePer': regex },
                { 'apPaternoPer': regex },
                { 'apMaternoPer': regex }
            ])
            .populate('fechas')
            .exec((err, personas) => {

                if (err) {
                    reject('Error al cargar usuarios', err);
                } else {
                    resolve(personas);
                }

            })

    });

}



//busqueda en una sola columna de la collection
function buscarProcesos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Proceso.find({ proceso: regex })
            .exec((err, procesos) => {

                if (err) {
                    reject('error al cargar procesos', err);
                } else {
                    resolve(procesos)
                }
            });

    });

}


function buscarModalidades(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Modalidad.find({ modalidad: regex })
            .exec((err, modalidades) => {

                if (err) {
                    reject('error al cargar modalidades', err);
                } else {
                    resolve(modalidades)
                }

            });

    });

}


function buscarCarreras(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Carrera.find({ carrera: regex })
            .exec((err, carreras) => {

                if (err) {
                    reject('error al cargar carreras', err);
                } else {
                    resolve(carreras)
                }

            });

    });

}


function buscarRequisitos(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Requisito.find({ requisito: regex })
            .exec((err, requisitos) => {

                if (err) {
                    reject('error al cargar requisitos', err);
                } else {
                    resolve(requisitos)
                }

            });

    });

}



module.exports = app;
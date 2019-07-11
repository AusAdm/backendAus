const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

var sexosValidos = {
    values: ['FEMENINO', 'MASCULINO'],
    message: '{VALUE} no es sexo permitido'
};

var tipoDocValidos = {
    values: ['DNI', 'CARNET DE EXTRANJERIA', 'PASAPORTE'],
    message: '{VALUE} no es un tipo de documento de identidad permitido'
};

let apoderadoSchema = new Schema({

    tipoDocIdentidadApo: {
        type: String,
        required: [true, 'el tipo de documento de identidad del apoderado es necesario'],
        default: 'DNI',
        enum: tipoDocValidos
    },
    numeroDocIdentidadApo: {
        type: Number,
        required: [true, 'el numero de documento de identidad del apoderado es necesario']
    },
    nombreApo: {
        type: String,
        required: [true, 'el nombre del apoderado es necesario']
    },
    apPaternoApo: {
        type: String,
        required: [true, 'el apellido paterno del apoderado es necesario']
    },
    apMaternoApo: {
        type: String,
        required: [true, 'el apellido materno del apoderado es necesario']
    },
    fechaNaciApo: {
        type: Date
    },
    edadApo: {
        type: Number
    },
    sexoApo: {
        type: String,
        required: [true, 'el sexo del apoderado es necesario'],
        enum: sexosValidos
    },
    direccionApo: {
        type: String,
        required: [true, 'la dirrecion del apoderado es necesario']
    },
    telefonoApo: {
        type: Number,
        required: [true, 'el numero de telefono del apoderado es necesario']
    }

});

module.exports = mongoose.model('Apoderado', apoderadoSchema);
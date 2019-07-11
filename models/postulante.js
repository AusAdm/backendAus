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

let postulanteSchema = new Schema({

    PaisOrigenPos: {
        type: String,
        required: [true, 'el pais es necesario'],
        default: 'Peru'
    },
    tipoDocIdentidadPos: {
        type: String,
        required: [true, 'el tipo de documento de identidad es necesario'],
        default: 'DNI',
        enum: tipoDocValidos
    },
    numeroDocIdentidadPos: {
        type: Number,
        required: [true, 'el numero de documento de identodad del postulante es necesario']
    },
    nombrePos: {
        type: String,
        required: [true, 'el nombre del postulante es necesario']
    },
    apPaternoPos: {
        type: String,
        required: [true, 'el apellido paterno es necesario']
    },
    apMaternoPos: {
        type: String,
        required: [true, 'el apellido materno del postulante es necesario']
    },
    fechaNaciPos: {
        type: Date,
        required: [true, 'la fecha de nacimiento del postulante es necesario']
    },
    edadPos: {
        type: Number,
        required: [true, 'la edad del postulante es necesario']
    },
    sexoPos: {
        type: String,
        required: [true, 'el sexo del postulante es necesario'],
        enum: sexosValidos
    },
    apoderado: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Apoderado'
    },
    infoAcademica: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InfoAcademica'
    }
});

module.exports = mongoose.model('Postulante', postulanteSchema);
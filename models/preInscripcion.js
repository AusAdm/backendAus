const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const DateOnly = require('mongoose-dateonly')(mongoose);

let Schema = mongoose.Schema;

var estadoCivilValidos = {
    values: ['SOLTERO(A)', 'CASADO(A)', 'VIUDO(A)'],
    message: '{VALUE} no es un tipo de estado civil permitido'
};

let preInscripcionSchema = new Schema({

    fechaHoraPre: {
        type: DateOnly,
        required: true,
        default: Date.now
    },
    departamentoPre: {
        type: String,
        required: [true, 'el departamento es necesario']
    },
    distritoPre: {
        type: String,
        required: [true, 'el distrito es necesario']
    },
    provinciaPre: {
        type: String,
        required: [true, 'la provincia es necesario']
    },
    direccionPre: {
        type: String,
        required: [true, 'la dirrecion es necesario']
    },
    estadoCivilPre: {
        type: String,
        required: [true, 'la dirrecion es necesario'],
        enum: estadoCivilValidos
    },
    emailPre: {
        type: String,
        required: [true, 'el email es necesario']
    },
    telefonoPre: {
        type: Number,
        required: [true, 'el telefono es necesario']
    },
    postulante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Postulante'
    }

});

module.exports = mongoose.model('PreInscripcion', preInscripcionSchema);
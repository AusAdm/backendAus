const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

var IEValidos = {
    values: ['CEBA', 'PARTICULAR', 'ESTATAL'],
    message: '{VALUE} no es un tipo de Institucion Educativa permitido'
};

let infoAcademicaSchema = new Schema({

    tipoIE: {
        type: String,
        required: [true, 'el tipo de IE es necesario'],
        enum: IEValidos
    },
    nombreIE: {
        type: String,
        required: [true, 'el nombre de IE es necesario']
    },
    añoEgreso: {
        type: Date,
        required: [true, 'el año de egreso es necesario']
    }

});

module.exports = mongoose.model('InfoAcademica', infoAcademicaSchema);
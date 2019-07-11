const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let carreraSchema = new Schema({

    carrera:{
        type: String,
        unique: true,
        required:[true, 'la carrera es necesario']
    },
    estadoCar:{
        type: Boolean,
        default: true
    }
});

//validacion de que el dato ingresado es unico 
carreraSchema.plugin(uniqueValidator, {message: '{PATH} DEBE DE SER UNICO'});


module.exports = mongoose.model('Carrera',carreraSchema);
const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let modalidadSchema = new Schema({

    modalidad:{
        type: String,
        unique: true,
        required:[true, 'la modalidad es necesaria']
    },
    estadoMod:{
        type: Boolean,
        default: true
    }
}, { collection: 'modalidades' });

//validacion de que el dato ingresado es unico 
modalidadSchema.plugin(uniqueValidator, {message: '{PATH} DEBE DE SER UNICO'});


module.exports = mongoose.model('Modalidad',modalidadSchema);
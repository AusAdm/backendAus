const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let procesoSchema = new Schema({

    proceso:{
        type: String,
        unique: true,
        required:[true, 'el proceso es necesario']
    },
    estadoPro:{
        type: Boolean,
        default: true
    }
});

//validacion de que el dato ingresado es unico 
procesoSchema.plugin(uniqueValidator, {message: '{PATH} DEBE DE SER UNICO'});


module.exports = mongoose.model('Proceso',procesoSchema);
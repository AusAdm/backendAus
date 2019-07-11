const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let requisitoSchema = new Schema({

    requisito:{
        type: String,
        unique: true,
        required:[true, 'el requisito es necesario']
    },
    estadoReq:{
        type: Boolean,
        default: true
    }
});

//validacion de que el dato ingresado es unico 
requisitoSchema.plugin(uniqueValidator, {message: '{PATH} DEBE DE SER UNICO'});


module.exports = mongoose.model('Requisito',requisitoSchema);
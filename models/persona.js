const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMINISTRADOR', 'OPERARIO'],
    message: '{VALUE} no es rol permitido'
};

let personaSchema = new Schema({

    DNIPer: {
        type: Number,
        unique: true,
        required: [true, 'el DNI es necesario'],
    },
    nombrePer: {
        type: String,
        required: [true, 'el nombre es necesario']
    },

    apPaternoPer: {
        type: String,
        required: [true, 'el apellido paterno es necesario']
    },
    apMaternoPer: {
        type: String,
        required: [true, 'el apellido materno es necesario']
    },
    telefonoPer: {
        type: Number,
        required: [true, 'el telefono es necesario']
    },
    password: {
        type: String,
        required: [true, 'el password es obligatoria']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'el correo es necesario']
    },
    rol: {
        type: String,
        required: [true, 'el rol es necesario'],
        default: 'OPERARIO',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true // valor por defecto true
    },
    img: {
        type: String,
        required: false
    },
    fechas: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Fecha'
    }
});

//se quita el objeto password cada ves que se pasa a un json
personaSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//validacion de que el dato ingresado es unico 
personaSchema.plugin(uniqueValidator, { message: '{PATH} DEBE DE SER UNICO' });



module.exports = mongoose.model('Persona', personaSchema);
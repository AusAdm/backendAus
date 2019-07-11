const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let modProSchema = new Schema({

    fechInicioMP: {
        type: Date,
        required: [true, 'la fecha de inicio es necesario'],
    },
    fechFinMP: {
        type: Date,
        required: [true, 'la fecha de fin es necesario'],
    },
    nombreMod: {
        type: String,
        required: [true, 'el nombre de la modalidad es necesario'],
    },
    estadoMP: {
        type: Boolean,
        default: true // valor por defecto true
    },
    proceso: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proceso'
    },
    modalidad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Modalidad'
    }

});

module.exports = mongoose.model('ModPro', modProSchema);
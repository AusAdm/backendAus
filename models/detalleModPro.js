const mongoose = require('mongoose');

let Schema = mongoose.Schema;


let detalleModProSchema = new Schema({

    nombreCar: {
        type: Array,
        required: [true, 'el nombre de la carrera es necesario'],
    },
    estadoDMP: {
        type: Boolean,
        default: true // valor por defecto true
    },
    carreras: [{
        type: (mongoose.Schema.Types.ObjectId),
        ref: 'Carrera'
    }],
    modPro: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ModPro'
    }

});

module.exports = mongoose.model('DetalleModPro', detalleModProSchema);
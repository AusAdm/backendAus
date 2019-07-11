const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let reqModSchema = new Schema({

    modalidad: {
        type: (mongoose.Schema.Types.ObjectId),
        ref: 'Modalidad'
    },
    requisitos: [{
        type: (mongoose.Schema.Types.ObjectId),
        ref: 'Requisito'
    }],
    estadoRM: {
        type: Boolean,
        default: true // valor por defecto true
    }

});

module.exports = mongoose.model('reqMod', reqModSchema);
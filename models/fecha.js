const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let fechaSchema = new Schema({
    fechInicioPer: {
        type: Date,
        required: [true, 'la fecha de inicio es obligatoria']
    },
    fechFinPer: {
        type: Date,
        required: [true, 'la fecha de fin es obligatoria']
    }
});


module.exports = mongoose.model('Fecha', fechaSchema);
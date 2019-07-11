var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

//===========================================================================
//                 VERIFICAR TOKEN
//===========================================================================


exports.verificaToken = function(req, res, next) {

    var token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'token incorrecto',
                errors: err
            });
        }

        req.persona = decoded.persona;

        next();




    });

}


//===========================================================================
//                 VERIFICAR ROLES DE ADMINISTRADOR
//===========================================================================

exports.verificaAdminRol = function(req, res, next) {

    var persona = req.persona;

    if (persona.rol === 'ADMINISTRADOR') {
        next();
        return;
    } else {

        return res.status(401).json({
            ok: false,
            mensaje: 'token incorrecto - no es administrador',
            errors: { message: 'No es administrador, no puede realizar esta accion' }
        });

    }

}



//===========================================================================
//                 VERIFICAR ADMIN O MISMO USUARIO
//===========================================================================

exports.verificaAdminUsuario = function(req, res, next) {

    var persona = req.persona;
    var id = req.params.id;

    per

    if (persona.rol === 'ADMINISTRADOR' || persona._id === id) {
        next();
        return;
    } else {

        return res.status(401).json({
            ok: false,
            mensaje: 'token incorrecto - no es administrador ni el mismo usuario',
            errors: { message: 'No es administrador  ni el mismo usuario, no puede realizar esta accion' }
        });

    }

}
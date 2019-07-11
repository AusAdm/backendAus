var express = require('express');
var fileUpload = require('express-fileupload'); //para subir los archivos
var fs = require('fs');
var app = express();

var Personas = require('../models/persona');

// default options
app.use(fileUpload());


//===========================================================================
//                 SUBIR ARCHIVO
//===========================================================================

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de collections
    var tiposValidos = ['personas'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'tipo de coleccion no es valida',
            errors: { message: 'tipo de coleccion no es valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'no selecciono nada',
            errors: { message: 'debe de sellecionar una imagen' }
        });
    }


    //obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCorto = archivo.name.split('.');
    var extensionArchivo = nombreCorto[nombreCorto.length - 1];

    //solo aceptamos estas extenciones
    var extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'extencion no valida',
            errors: { message: 'las extenciones validas son ' + extencionesValidas.join(', ') }
        });
    }

    //nombre de archivo perzonalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //mover el archivo del temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'error al mover archivo',
                errors: err
            });
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

    });

});


//===========================================================================
//                 SUBIR POR TIPO
//===========================================================================

function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'personas') {
        Personas.findById(id, (err, persona) => {

            if (!persona) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'usario no existe',
                    errors: { message: 'usuario no existe' }
                });
            }

            var pathViejo = './uploads/personas/' + persona.img;

            //si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);
            }

            persona.img = nombreArchivo;

            persona.save((err, personaActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'imagen de usuario actualizada',
                    persona: personaActualizado
                });
            });

        });
    }


};



module.exports = app;
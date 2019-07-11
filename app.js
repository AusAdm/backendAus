//requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


//incializar variables 
var app = express();


//cors 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});


//body parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())



//importar rutas
var personaRoutes = require('./routes/persona');
var login = require('./routes/login');
var procesoRoutes = require('./routes/proceso');
var modalidadRoutes = require('./routes/modalidad');
var carreraRoutes = require('./routes/carrera');
var requisitoRoutes = require('./routes/requisito');

var modProRoutes = require('./routes/modPro');
var detalleMPRoutes = require('./routes/detalleModPro');
var reqModRoutes = require('./routes/reqMod');

var preInscripcionRoutes = require('./routes/preInscripcion');

var busquedaRoutes = require('./routes/busqueda'); //busqueda
var uploadRouters = require('./routes/upload'); //sube imagenes por tipo
var imagenesRouters = require('./routes/imagenes'); //?



//conecion a la base de datos 
const dbpath = "mongodb://localhost:27017/admision";
//const dbpath = "mongodb://admin:admin@ds123929.mlab.com:23929/austral"

const mongo = mongoose.connect(dbpath, { useNewUrlParser: true });
mongo.then(() => {
    console.log('Base de datos: \x1b[32m%s\x1b[0m', ' conectada');
}).catch((err) => {
    console.log('err', err);
});


//rutas
app.use('/persona', personaRoutes);
app.use('/login', login);
app.use('/proceso', procesoRoutes);
app.use('/modalidad', modalidadRoutes);
app.use('/carrera', carreraRoutes);
app.use('/requisito', requisitoRoutes);

app.use('/modPro', modProRoutes);
app.use('/detalleMP', detalleMPRoutes);
app.use('/reqMod', reqModRoutes);

app.use('/preInscripcion', preInscripcionRoutes);

app.use('/busqueda', busquedaRoutes); //busqueda
app.use('/upload', uploadRouters); //subir imagen
app.use('/img', imagenesRouters); //mostrar imagen




//escuchar peticiones 
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', ' online');
})
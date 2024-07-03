// importar módulos de terceros
const express = require('express');
const morgan = require('morgan');

// creamos una instancia del servidor Express
const app = express();

//Tenemos que usar nuevo middleware para indicar a Express que queremos procesar petición de tipo POST
app.use(express.urlencoded({ extended: true }));

// Base de datos de imágenes
const images = [];

// Especificar a Express que quiero usar EJS como motor de plantillas
app.set('view engine', 'ejs');

// Usamos el middleware morgan para loguear las peticiones del cliente
app.use(morgan('tiny'));

// Cuando nos hagan una petición GET a '/' renderizamos la home.ejs
app.get('/', (req, res) => {
    
    // 2. Usar en el home.ejs el forEach para iterar por todas las imágenes de la variable 'images'. Mostrar de momento solo el título 
    res.render('home', {images});
});

//Cuando nos hagan una petición GET a '/add-image-form' renderizammos image-form.ejs
app.get('/add-image-form', (req, res) => {
    res.render('image-form')
})

// Cuando nos hagan una petición POST a '/add-image-form' tenemos que recibir los datos del formulario y actualizar nuestra "base de datos"
app.post('/add-image-form', (req, res) => {
    // todos los datos vienen en req.body
    console.log(req.body);

    // 1. Actualizar el array 'images' con la información de req.body
    const { title } = req.body;
    images.push({
        title
    });
    console.log('array',images)

    // 3. Añadir los otros campos del formulario y sus validaciones 
        // 4julio: Tras insertar una imagen 'dejaremos' el formulario visible 
    //res.send('Datos recibidos');
    // Redirect es un método del objecto Response que permite 'redirigir' al cliente a un nuevo endpoint o vista
    res.redirect('/');

});

// en el futuro es normal que tengamos endpoints como
// app.get('/edit-image-form')

app.listen(3000, (req, res) => {
    console.log("Servidor escuchando correctamente en el puerto 3000.")
});

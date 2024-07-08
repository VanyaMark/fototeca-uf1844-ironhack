// importar módulos de terceros
const express = require('express');
const morgan = require('morgan');

// creamos una instancia del servidor Express
const app = express();

//Tenemos que usar nuevo middleware para indicar a Express que queremos procesar petición de tipo POST
app.use(express.urlencoded({ extended: true }));

// Añadimos el middleware necesario para que el client puedo hacer peticiones GET a los recursos públicos de la carpeta 'public'
app.use(express.static('public'));

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

       //Set current date
   const today = new Date().toISOString().split('T')[0];

    res.render('image-form',  {
        isImageAdded: undefined,
        imageAlreadyAdded: undefined,
        duplicatedImageUrl: undefined, 
        today
    })
})

// Cuando nos hagan una petición POST a '/add-image-form' tenemos que recibir los datos del formulario y actualizar nuestra "base de datos"
app.post('/add-image-form', (req, res) => {
    // todos los datos vienen en req.body
   // console.log(req.body);

          //Set current date
          const today = new Date().toISOString().split('T')[0];

    // 1. Actualizar el array 'images' con la información de req.body
    const { title, imageUrl, datePic } = req.body;

    let imageAlreadyAdded = false;
    let duplicatedImageUrl = undefined;
    const isImageAlreadyAdded = images.some(i => i.imageUrl === imageUrl)
    if (isImageAlreadyAdded) {
        imageAlreadyAdded = true;
        duplicatedImageUrl = imageUrl;
        console.log('imageAlreadyAdded: ', imageAlreadyAdded);
        console.log('array when imageAdded true: ', images)
    } else {
            images.push({
                title: title.toUpperCase(),
                imageUrl,
                datePic
            });

            images.sort((a, b) => new Date(a.datePic) - new Date(b.datePic));
            console.log('array sorted by date',images)
    }

    // 3. Añadir los otros campos del formulario y sus validaciones 
        // 4julio: Tras insertar una imagen 'dejaremos' el formulario visible 
    //res.send('Datos recibidos');
    // Redirect es un método del objecto Response que permite 'redirigir' al cliente a un nuevo endpoint o vista
    res.render('image-form', {
        isImageAdded: true,
        imageAlreadyAdded,
        duplicatedImageUrl, 
        today
    });

});

// en el futuro es normal que tengamos endpoints como
// app.get('/edit-image-form')

app.listen(3000, (req, res) => {
    console.log("Servidor escuchando correctamente en el puerto 3000.")
});

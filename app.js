// importar módulos de terceros
const express = require("express");
const morgan = require("morgan");

// import method getColorFromUrl from color-thief-node package
const { getColorFromURL } = require("color-thief-node");

// The express() function creates an Express application
// We create our own server named app
// Express server will be handling requests and responses
const app = express();

//Tenemos que usar nuevo middleware para indicar a Express que queremos procesar petición de tipo POST
app.use(express.urlencoded({ extended: true }));

// Añadimos el middleware necesario para que el client puedo hacer peticiones GET a los recursos públicos de la carpeta 'public'
app.use(express.static("public"));

// Forma más simple. Variable global para saber cual es el siguiente Id que nos tocan
let id = 5;

// Variable para indicar en qué puerto tiene que escuchar nuestra app
const PORT = process.env.PORT || 3000;

//Base de datos
// let images = [
//   {
//     id: 1,
//     title: "happy cat",
//     imageUrl:
//       "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg",
//     datePic: "2024-07-03",
//   },
//   {
//     id: 2,
//     title: "happy dog",
//     imageUrl:
//       "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     datePic: "2024-02-11",
//   },
//   {
//     id: 3,
//     title: "cat snow",
//     imageUrl:
//       "https://images.pexels.com/photos/3923387/pexels-photo-3923387.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
//     datePic: "2024-04-21",
//   },
//   {
//     id: 4,
//     title: "camera",
//     imageUrl:
//       "https://images.pexels.com/photos/19607905/pexels-photo-19607905/free-photo-of-photos-and-insta-camera-on-table.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load",
//     datePic: "2024-06-24",
//   },
// ];

let images = [];

// Initialize tagsArr as a Set
let tagsArr = new Set();

// Especificar a Express que quiero usar EJS como motor de plantillas
app.set("view engine", "ejs");

// Usamos el middleware morgan para loguear las peticiones del cliente
app.use(morgan("tiny"));

// Cuando nos hagan una petición GET a '/' renderizamos la home.ejs
app.get("/", (req, res) => {
  // 2. Usar en el home.ejs el forEach para iterar por todas las imágenes de la variable 'images'. Mostrar de momento solo el título
  console.log("tagsArr del Home: ", tagsArr.values());
  res.render("home", { images, tagsArr });
});

//New endpoint for the search form
app.get("/search", (req, res) => {
  // Extract query string
  const { keyword } = req.query;

  const searchResult = images.filter((i) =>
    i.title.toUpperCase().includes(keyword.toUpperCase())
  );

  res.render("home", {
    images: searchResult,
    tagsArr,
  });
});

//New endpoint for filter form
app.get("/filter", (req, res) => {
  const { selectedTag } = req.query;

  // Use the selectedTag to filter or perform any necessary operations
  console.log("Selected tag:", selectedTag);
  console.log("blah");

  const filteredImages = images.filter((image) => {
    // Use some method to check if any tag.value matches selectedTag
    
    const tagsArray = JSON.parse(image.tags);
    console.log('image ', image)
    console.log('image.tags ', image.tags)

    return tagsArray.some((tag) => tag.value === selectedTag);
  });
  
  res.render("home", {
    images: filteredImages,
    tagsArr,
  });
});

//Cuando nos hagan una petición GET a '/add-image-form' renderizammos image-form.ejs
app.get("/add-image-form", (req, res) => {
  //Set current date to use to limit the images dates only to today and not the future
  const today = new Date().toISOString().split("T")[0];

  res.render("image-form", {
    isImageAdded: undefined,
    isImageAlreadyAdded: undefined,
    duplicatedImageUrl: undefined,
    today,
  });
});

// Cuando nos hagan una petición POST a '/add-image-form' tenemos que recibir los datos del formulario y actualizar nuestra "base de datos"
app.post("/add-image-form", (req, res) => {
  // todos los datos vienen en req.body
  // console.log(req.body);

  //Set current date to use to limit the images dates only to today and not the future, I need to set it both in post and get
  const today = new Date().toISOString().split("T")[0];

  // 1. Actualizar el array 'images' con la información de req.body
  const { title, imageUrl, tags, datePic } = req.body;

  // Incremento la varible id para el obtener el siguiente identificador único
  id++;

  //Validación del lado servidor del title
  if (!title || title.length > 30) {
    return res.status(400).send("Algo ha salido mal");
  }

  //let imageAlreadyAdded = false;
  let duplicatedImageUrl = undefined;
  const isImageAlreadyAdded = images.some((i) => i.imageUrl === imageUrl);
  if (isImageAlreadyAdded) {
    duplicatedImageUrl = imageUrl;
  } else {
    //Use method getColorFromUrl to find the dominant color in the image and add it to the database

    getColorFromURL(imageUrl)
      .then((dominantColor) => {
        console.log("dominant color: ", dominantColor);
        images.push({
          id,
          title,
          imageUrl,
          datePic,
          tags,
          dominantColor: `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`,
        });

        return images;
      })
      .then((images) => {
        // Parse tags and add them to tagsArr Set
        let imageTags = JSON.parse(tags);
        console.log("imageTags: ", imageTags);
        console.log("imageTags[0].value", imageTags[0].value);

        imageTags.forEach((tag) => {
          tagsArr.add(tag.value);
        });

        // Log the updated tagsArr
        console.log("tagsArr: ", tagsArr);

        return images;
      })
      .then((images) => {
        images.sort((a, b) => new Date(a.datePic) - new Date(b.datePic));
        console.log("array sorted by date", images);
        return images;
      })
      .then((images) => {
        // Redirect es un método del objecto Response que permite 'redirigir' al cliente a un nuevo endpoint o vista
        res.render("image-form", {
          isImageAdded: true,
          isImageAlreadyAdded,
          duplicatedImageUrl,
          today,
          tagsArr,
        });
      })
      .catch((err) => console.log("Something bad has happened: ", err));
  }
});

// endpoint para borrar la imagen
app.post("/images/:id/delete", (req, res) => {
  // 1. ¿Cómo vamos a obtener la url de la imagen que quiere borrar el cliente? req.params.url
  console.log("req params: ", req.params);
  const { id } = req.params;
  // 2. images? Usar el método filter para eliminar la imagen que me pasan por req.params.id

  // Opción 1: 3. Sobreescribir el array images con el resultado del método filter
  images = images.filter((i) => i.id != id);

  // Opctión 2: Usar el método de array splice para eliminar el elemento del array images. Antes teneis que identificar el índice donde se encuentra la imagen que queremos borrar

  // 3. Volvemos a hacer un render
  res.redirect("/");
});

// en el futuro es normal que tengamos endpoints como
// app.get('/edit-image-form')

app.listen(PORT, (req, res) => {
  console.log("Servidor escuchando correctamente en el puerto " + PORT);
});

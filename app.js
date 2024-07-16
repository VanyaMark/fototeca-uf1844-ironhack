// Import third-party modules
const express = require("express");
const morgan = require("morgan");
// import method getColorFromUrl from color-thief-node package
const { getColorFromURL } = require("color-thief-node");

// Create Express application
// The express() function creates an Express application
// We create our own server named app
// Express server will be handling requests and responses
const app = express();

// Middleware to process POST requests
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files from the 'public' folder
app.use(express.static("public"));

// Initialize global variables
let id = 5; // Next ID for new images

// Variable para indicar en qué puerto tiene que escuchar nuestra app
const PORT = process.env.PORT || 3000;

let images = []; // Array to store image data
let tagsArr = new Set(); // Set to store unique tags

// Set EJS as the view engine
app.set("view engine", "ejs");

// Middleware to log requests using Morgan
app.use(morgan("tiny"));



// Route: GET '/' - Render home page
app.get("/", (req, res) => {
  // Log tagsArr values
  console.log("tagsArr from Home: ", tagsArr.values());
  
  // Render 'home' template with images and tagsArr data
  res.render("home", { images, tagsArr });
});

// Route: GET '/search' - Handle search functionality
app.get("/search", (req, res) => {
   // Extract query string
  const { keyword } = req.query;

  // Filter images based on search keyword
  const searchResult = images.filter((i) =>
    i.title.toUpperCase().includes(keyword.toUpperCase())
  );

  // Render 'home' template with search results and tagsArr data
  res.render("home", { images: searchResult, tagsArr });
});

// Route: GET '/filter' - Handle filter functionality
app.get("/filter", (req, res) => {
  const { selectedTag } = req.query;

  // Filter images based on selected tag
  const filteredImages = images.filter((image) => {
    const tagsArray = JSON.parse(image.tags);
    return tagsArray.some((tag) => tag.value === selectedTag);
  });

  // Render 'home' template with filtered images and tagsArr data
  res.render("home", { images: filteredImages, tagsArr });
});

// Route: GET '/add-image-form' - Render form to add new image
app.get("/add-image-form", (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // Get current date

  // Render 'image-form' template with necessary variables
  res.render("image-form", {
    isImageAdded: undefined,
    isImageAlreadyAdded: undefined,
    duplicatedImageUrl: undefined,
    today,
  });
});

// Route: POST '/add-image-form' - Handle form submission to add new image
app.post("/add-image-form", (req, res) => {
  const today = new Date().toISOString().split("T")[0]; // Get the current date in 'YYYY-MM-DD' format
  const { title, imageUrl, tags, datePic } = req.body; // Extract data from the request body

  id++; // Increment the global ID for the new image

  // Validate the title on the server side: it should not be empty or longer than 30 characters
  if (!title || title.length > 30) {
    return res.status(400).send("Something went wrong");
  }

  let duplicatedImageUrl = undefined; // Initialize variable to store the duplicated image URL if found
  const isImageAlreadyAdded = images.some((i) => i.imageUrl === imageUrl); // Check if the image URL already exists in the database

  // If the image is not already added, fetch the dominant color and add the image to the database
  if (!isImageAlreadyAdded) {
    getColorFromURL(imageUrl)
      .then((dominantColor) => {
        // Add the new image object to the images array with all required properties
        images.push({
          id,
          title,
          imageUrl,
          datePic,
          tags,
          dominantColor: `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`,
        });

        return images; // Return the updated images array for further processing
      })
      .then((images) => {
        // Parse the tags JSON string into an array of tag objects
        let imageTags = JSON.parse(tags);

        // Add each tag value to the tagsArr Set to ensure unique tags
        imageTags.forEach((tag) => {
          tagsArr.add(tag.value);
        });

        // Log the updated tagsArr for debugging purposes
        console.log("tagsArr: ", tagsArr);

        return images; // Return the images array for further processing
      })
      .then((images) => {
        // Sort the images array by datePic in ascending order
        images.sort((a, b) => new Date(a.datePic) - new Date(b.datePic));
        
        return images; // Return the sorted images array for further processing
      })
      .then((images) => {
        // Render the image-form view with the provided variables
        res.render("image-form", {
          isImageAdded: true, // Indicate that the image was successfully added
          isImageAlreadyAdded: false, // Indicate that the image was not already added
          duplicatedImageUrl: undefined, // No duplicated image URL
          today, // Pass the current date
          tagsArr, // Pass the updated tags array
        });
      })
      .catch((err) => console.log("Error: ", err)); // Handle any errors that occur during the process
  } else {
    // If the image is already added, set the duplicatedImageUrl and render the image-form view with appropriate variables
    duplicatedImageUrl = imageUrl;
    res.render("image-form", {
      isImageAdded: false, // Indicate that the image was not added
      isImageAlreadyAdded: true, // Indicate that the image was already added
      duplicatedImageUrl, // Pass the duplicated image URL
      today, // Pass the current date
      tagsArr, // Pass the tags array
    });
  }
});


// Route: POST '/images/:id/delete' - Handle deletion of image
app.post("/images/:id/delete", (req, res) => {
  const { id } = req.params;

  // Filter images array to remove image with specified ID
  images = images.filter((i) => i.id != id);

  // Redirect to home page after deletion
  res.redirect("/");
});

// Start listening on specified PORT
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});



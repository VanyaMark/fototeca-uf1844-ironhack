# Fototeca Explained

## Initial Setup

- **Express Setup**
  - Use Express to create routes and set the server’s port using `app.listen()`.
  - Configure Express to serve static files from the `public` folder using `express.static()`.
  - Enable URL encoding to handle POST requests with `express.urlencoded()`.

- **Morgan Middleware**
  - Integrate Morgan to log HTTP requests. Morgan is an npm package that provides a simple way to log HTTP requests and their details, useful for monitoring and debugging.

- **Tags Array**
  - Create `tagsArr` as a new `Set()`. The `Set` object in JavaScript allows you to store unique values of any type.

- **View Engine**
  - Set the view engine to EJS (Embedded JavaScript). EJS is used for dynamically generating HTML by rendering templates with data from the server. It allows embedding JavaScript code within HTML. Other templating engines include Handlebars and Pug (formerly Jade).

## Routes and Templates

- **Home Route (`/`)**
  - Define a GET route to render the home page with a list of images and tags.

- **Search Route (`/search`)**
  - Define a GET route to search for images by keyword in the title.
  - Add a search form to the partial navigation view. Use the submit button to send the query string to the server.
  - On the server side, get `req.query` and filter images using the `filter` and `includes` methods:

    ```javascript
    const searchResult = images.filter(i => i.title.toUpperCase().includes(keyword.toUpperCase()));
    ```

- **Filter Route (`/filter`)**
  - Define a GET route to filter images by the selected tag.
  - Add a filter form to `home.ejs` that renders only if `tagsArr.size` is greater than 0. Use the `onchange` event to automatically submit the form:

    ```javascript
    document.getElementById("filterForm").submit();
    ```

- **Add Image Form Route (`/add-image-form`)**

  - **GET Request**
    - Define a GET route to render the form for adding a new image.
    - Create a new `Date` variable for the current day to limit the calendar to today. Pass this variable to the view:

      ```javascript
      app.get("/add-image-form", (req, res) => {
        res.render("image-form", { today: new Date().toISOString().split('T')[0] });
      });
      ```

  - **POST Request**
    - Define a POST route to handle form submissions for adding a new image.
    - Set the `today` variable using `new Date()`.
    - Deconstruct `req.body` to get form data. Validate input and check for duplicates:

      ```javascript
      const isImageAlreadyAdded = images.some(i => i.imageUrl === imageUrl);
      if (isImageAlreadyAdded) {
        res.render("image-form", { error: "Image URL already exists." });
      } else {
        // Use color-thief-node to get the dominant color
        // Process tags from Tagify component
        // Add new image to images array and sort by date
      }
      ```

    - Handle errors and manage duplicate URLs. Use promises to handle asynchronous operations:

      ```javascript
      // Color-thief-node and tag processing
      ```

- **Delete Image Route (`/images/:id/delete`)**
  - Define a POST route with a dynamic segment to delete an image by its ID.
  - Use `req.params` to get the image ID and remove it from the `images` array:

    ```javascript
    app.post("/images/:id/delete", (req, res) => {
      const id = req.params.id;
      images = images.filter(i => i.id !== id);
      res.redirect("/");
    });
    ```

This documentation outlines the setup, routes, and data management for the Fototeca application, providing a clear explanation of the server-side logic and template rendering.
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
      app.post("/add-image-form", async (req, res) => {
        const { title, imageUrl, date, tags } = req.body;
        const isImageAlreadyAdded = images.some(i => i.imageUrl === imageUrl);

        if (isImageAlreadyAdded) {
          return res.render("image-form", { error: "Image URL already exists." });
        }

        try {
          const dominantColor = await getDominantColor(imageUrl);
          const tagsArray = JSON.parse(tags);
          tagsArray.forEach(tag => tagsArr.add(tag));
          images.push({ id: generateId(), title, imageUrl, date, tags: tagsArray, color: dominantColor });
          images.sort((a, b) => new Date(b.date) - new Date(a.date));
          res.redirect("/");
        } catch (error) {
          res.render("image-form", { error: "Error processing image." });
        }
      });
      ```

### Error Management

- **Server-Side Validation**:
  - Ensure that the `title` is present and meets the minimum length requirement. This validation is done on the server side:

    ```javascript
    if (!title || title.length < 3) {
      return res.render("image-form", { error: "Title is required and should be at least 3 characters long." });
    }
    ```

- **Client-Side Validation**:
  - **Title Symbols**: Use the `pattern` attribute in HTML to ensure that the title contains only alphanumeric characters and spaces:

    ```html
    <input type="text" name="title" pattern="[a-zA-Z0-9_ ]+" required>
    ```

  - **Image URL**: Validate the URL to ensure it starts with `https://`:

    ```html
    <input type="url" name="imageUrl" pattern="https://.*" required>
    ```

  - **Date**: Limit the date input to today or future dates:

    ```html
    <input type="date" name="date" max="<%= today %>" required>
    ```

- **Duplicate Image URL Check**:
  - Check if the `imageUrl` already exists in the `images` array. If it does, render an error message:

    ```javascript
    const isImageAlreadyAdded = images.some(i => i.imageUrl === imageUrl);
    if (isImageAlreadyAdded) {
      res.render("image-form", { error: "Image URL already exists." });
    }
    ```

- **Using Color-Thief and Tagify**:
  - **Color-Thief**: Use the `color-thief-node` package to get the dominant color of the image. Handle the promise to ensure the color is added correctly:

    ```javascript
    const getDominantColor = require('color-thief-node');
    getDominantColor(imageUrl).then(color => {
      // Proceed with image processing
    }).catch(err => {
      // Handle errors
    });
    ```

  - **Tagify**: Parse the tags JSON string received from Tagify. Add tags to a `Set` to ensure uniqueness:

    ```javascript
    new Promise((resolve, reject) => {
      const tagsArray = JSON.parse(tags);
      tagsArray.forEach(tag => tagsArr.add(tag));
      resolve();
    });
    ```

### Sorting and Rendering

- **Sorting**:
  - Sort the `images` array by date to display them in chronological order:

    ```javascript
    images.sort((a, b) => new Date(b.date) - new Date(a.date));
    ```

- **Rendering the Form**:
  - After processing and sorting the images, render the `image-form` view with all necessary variables:

    ```javascript
    res.render("image-form", { images, tagsArr: [...tagsArr] });
    ```

- **Error Handling**:
  - Catch any errors during image processing or color fetching. Provide a fallback mechanism to handle issues gracefully:

    ```javascript
    .catch(error => {
      res.render("image-form", { error: "Error processing image." });
    });
    ```

- **Delete Image Route (`/images/:id/delete`)**
  - Define a POST route with a dynamic segment to delete an image by its ID. Remove the image from the `images` array:

    ```javascript
    app.post("/images/:id/delete", (req, res) => {
      const id = req.params.id;
      images = images.filter(i => i.id !== id);
      res.redirect("/");
    });
    ```

This documentation provides a comprehensive overview of the Fototeca application, covering setup, routes, error management, and handling asynchronous operations. It ensures that the application runs smoothly and provides a good user experience.






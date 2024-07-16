# Fototeca IronHack 2024

Fototeca IronHack 2024 is a web application built using Node.js, Express, and EJS, designed to manage a collection of images. Users can add, search, and filter images, as well as view a list of images with their details.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Routes](#routes)
- [Views](#views)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/fototeca-ironhack-2024.git
    ```
2. Navigate to the project directory:
    ```sh
    cd fototeca-ironhack-2024
    ```
3. Install the dependencies:
    ```sh
    npm install
    ```
4. Start the application:
    ```sh
    npm start
    ```
   or with Nodemon for development:
    ```sh
    npm run dev
    ```

## Usage

1. Open your browser and navigate to `http://localhost:3000`.
2. Use the navigation bar to switch between the home page and the form to add new images.
3. Add new images by filling out the form and submitting it.
4. Search for images using the search form in the navigation bar.
5. Filter images by tags using the dropdown on the home page.
6. Delete images by clicking the "Delete" button below each image.

## Project Structure

```
fototeca-ironhack-2024/
├── public/
│ ├── styles.css
│ ├── form.js
│ ├── tagify.js
├── views/
│ ├── partials/
│ │ ├── head.ejs
│ │ ├── nav.ejs
│ ├── home.ejs
│ ├── image-form.ejs
├── app.js
├── package.json
└── README.md
```

## Routes

### GET `/`
Render the home page with the list of images and tags.

### GET `/search`
Search for images by keyword in the title.

### GET `/filter`
Filter images by selected tag.

### GET `/add-image-form`
Render the form to add a new image.

### POST `/add-image-form`
Handle the form submission to add a new image. Fetches the dominant color of the image and stores it along with the image data.

### POST `/images/:id/delete`
Delete an image by its ID.

## Views

### `home.ejs`
The main view that displays the list of images and allows for searching and filtering.

### `image-form.ejs`
The form view for adding a new image.

### `partials/head.ejs`
The head partial, includes meta tags and CSS links.

### `partials/nav.ejs`
The navigation partial, includes links to the home page and the add image form.

## Dependencies

- [Express](https://expressjs.com/) - Web framework for Node.js
- [EJS](https://ejs.co/) - Embedded JavaScript templating
- [Morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware for Node.js
- [color-thief-node](https://www.npmjs.com/package/color-thief-node) - Get the dominant color from an image URL

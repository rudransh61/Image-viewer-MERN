const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();

// Enable CORS for all origins (replace '*' with the specific origin of your frontend application)
app.use(cors());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads')); // Adjust the path as needed
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer middleware with the defined storage options
const upload = multer({ storage: storage });

app.post('/upload/api', upload.single('image'), (req, res) => {
    // If an image was uploaded successfully, send back its filename
    if (req.file) {
        const imageName = req.file.filename; // Get the filename
        console.log(imageName);
        res.json({ imageUrl: `/uploads/${imageName}` }); // Respond with the absolute URL to the image
    } else {
        res.status(400).json({ error: 'No image uploaded' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

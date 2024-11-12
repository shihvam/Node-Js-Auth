const express = require('express');
const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware.js');
const uploadMiddleware = require('../middleware/upload-middleware.js');
const {uploadImageController, fetchImagesController, deleteImageController} = require('../controllers/image-controller.js')

const router = express.Router();


//upload an image
router.post('/upload', authMiddleware, adminMiddleware , uploadMiddleware.single("image"), uploadImageController  );


//to get all the images
router.get('/get', authMiddleware, fetchImagesController);

//delete image router

//berryId : 6731baca5f776428c624000a
router.delete('/:id', authMiddleware, adminMiddleware, deleteImageController);

//to get all image
module.exports = router;
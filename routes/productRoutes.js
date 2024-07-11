const express = require('express');
const router = express.Router();


const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  uploadImage,
} = require('../controllers/productController');


router
  .route('/')
  .post(createProduct)
  .get(getAllProducts);

router
  .route('/uploadImage')
  .post(uploadImage);

router
  .route('/:id')
  .get(getSingleProduct)

module.exports = router;

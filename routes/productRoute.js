const express = require('express');
//
const productController = require('./../controllers/productController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post(
  '/',
  authController.protect,
  authController.checkUserRole('seller'),
  productController.addProductImages,
  // productController.addCertificateImages,
  productController.addProduct,
);
router.get(
  '/',
  authController.protect,
  authController.checkUserRole('seller'),
  productController.getAllProducts,
);

router.patch(
  '/',
  authController.protect,
  authController.checkUserRole('seller'),
  productController.updateAProduct,
);
router.delete(
  '/',
  authController.protect,
  authController.checkUserRole('seller'),
  productController.deleteAProduct,
);

router.get('/product/:productId', productController.getProductDetails);
module.exports = router;

const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const shopController = require('../controllers/shopController');
router.post(
  '/',
  authController.protect,
  authController.checkUserRole('seller'),
  shopController.addShopImages,
  shopController.createShop,
);
router.get(
  '/stores',
  authController.protect,
  authController.checkUserRole('seller'),
  shopController.getAllStores,
);
router.get('/:id', shopController.getShop);
router.get('/products/:id', shopController.getUserProducts);
module.exports = router;

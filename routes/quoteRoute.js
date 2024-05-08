const express = require('express');
const authController = require('../controllers/authController');
const quotationController = require('../controllers/quotationController');
const router = express.Router();

router.post(
  '/',
  authController.protect,
  quotationController.uploadQuote,
  quotationController.createQuotation,
);
router.post(
  '/seller',
  authController.protect,
  authController.checkUserRole('seller'),
  quotationController.uploadQuote,
  quotationController.createSellerQuote,
);
router.get('/', authController.protect, quotationController.getQuotes);
router.get(
  '/quotes/all',
  authController.protect,
  quotationController.getAllQuotes,
);
router.get('/:id', authController.protect, quotationController.getQuote);
module.exports = router;

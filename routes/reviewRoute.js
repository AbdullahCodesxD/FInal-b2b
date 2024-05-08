const express = require('express');
const router = express.Router({ mergeParams: true });

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// router.all('/').post(reviewController.addReview);

// router.post('/', authController.addReview);

router.post('/', authController.protect, reviewController.addReview);
router.get('/', authController.protect, reviewController.allReviews);
// router.post('/', reviewController.addReview);

// router.all('/').post(authController.protect, reviewController.addReview);

module.exports = router;

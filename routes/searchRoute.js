// Router
const express = require('express');
const searchController = require('./../controllers/searchController');
const router = express.Router();
//

router.route('/:search').get(searchController.searchProducts);
router
  .route('/categories/:category')
  .get(searchController.searchProductByCategory);

module.exports = router;

const express = require('express');
const router = express.Router();

const categoriesController = require('../controllers/categoriesControllers');

router.get('/', categoriesController.getAll);

module.exports = router;

const express = require('express');
const router = express.Router();

const productsController = require('../controllers/productsController');

router.get('/', productsController.getAll);
router.post('/', productsController.create);
router.get('/detail/:id', productsController.getById);

module.exports = router;

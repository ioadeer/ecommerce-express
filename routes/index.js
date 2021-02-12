const express = require('express');

const router = express.Router();

const { getTopFive } = require('../controllers/productsController');

/* GET home page. */
router.get('/landing', getTopFive);

module.exports = router;

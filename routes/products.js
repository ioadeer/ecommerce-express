const express = require('express');
const passport = require('passport');

const router = express.Router();

const productsController = require('../controllers/productsController');

router.get('/', productsController.getAll);
router.post('/', productsController.create);
router.get('/detail/:id', productsController.getById);
router.delete('/delete/:id', productsController.delete);
router.post('/checkout/:id', 
            passport.authenticate('jwt', { session: false }),
            productsController.checkOut
            );

module.exports = router;

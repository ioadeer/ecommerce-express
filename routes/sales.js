const express = require('express');
const passport = require('passport');

const router = express.Router();

const salesController = require('../controllers/salesController');

router.post('/checkout/:id', 
            passport.authenticate('jwt', { session: false }),
            salesController.checkOut
            );

router.get('/detail/:id', 
            passport.authenticate('jwt', { session: false }),
           salesController.getSellById
          );

router.post('/confirm', 
            passport.authenticate('jwt', { session: false }),
           salesController.confirmPurchase
          );

router.get('/user', 
            passport.authenticate('jwt', { session: false }),
           salesController.getUsersPurchases
          );

module.exports = router;

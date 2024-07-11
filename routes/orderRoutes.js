const express = require('express');
const router = express.Router();

const {
    getAllOrders,
    createOrder,
    captureOrder
} = require('../controllers/orderController');

router.get('/config/paypal', (req, res) => {
    res.json({ clientId: 'AQxJH1P4El7fyE4Ti_olMS4u8kptEkp-m0HLxz2hGUJT0W4eWgHXLrncUrJkpVY-IajTBz7xqmm_Pg7G' });
});

router
    .route('/')
    .post(createOrder)
    .get(getAllOrders);

router
    .route('/capture')
    .post(captureOrder);

module.exports = router;

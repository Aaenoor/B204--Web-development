const Order = require('../models/Order');
const { StatusCodes } = require('http-status-codes');
const paypal = require('@paypal/checkout-server-sdk');

let clientId = process.env.PAYPAL_CLIENT_ID;
let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

let environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
let client = new paypal.core.PayPalHttpClient(environment);

const createOrder = async (req, res) => {
    const { items, total, name } = req.body;

    if (!total || isNaN(total)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid total value' });
    }
    let request = new paypal.orders.OrdersCreateRequest();
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: (total / 100).toFixed(2),
            },
            description: name
        }]
    });

    try {
        const order = await client.execute(request);
        res.status(StatusCodes.CREATED).json({ orderId: order.result.id });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const captureOrder = async (req, res) => {
    const { orderId, name, total } = req.body;


    if (!orderId) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Order ID is required' });
    }

    let request = new paypal.orders.OrdersCaptureRequest(orderId);

    try {
        const capture = await client.execute(request);


        const amountValue = total;

        const order = await Order.create({
            name: name,
            price: amountValue,
            amount: 1,
            delivered: true
        });

        res.status(StatusCodes.OK).json({ order, capture });
    } catch (error) {
        console.error(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    const orders = await Order.find({});
    res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

module.exports = {
    getAllOrders,
    createOrder,
    captureOrder,
};

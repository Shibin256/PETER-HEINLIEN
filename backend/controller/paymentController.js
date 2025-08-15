import Razorpay from 'razorpay'
import crypto from 'crypto'
import Order from '../model/orderModel.js'
import Product from '../model/productModel.js'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
})

export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount } = req.body

        const options = {
            amount: amount * 100,
            currency: 'INR',
            receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
        }


        const order = await razorpay.orders.create(options);
        res.status(200).json({ success: true, order });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error generating invoice' });
    }
}

export const verifyRazorpayPayment = async (req, res) => {
    console.log(req.body, '=------=====')
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body.paymentDetails;
    console.log(req.body.paymentDetails, 'payment deatialsss')
    const orderId = req.body.orderId

    console.log(razorpay_payment_id, '--------', orderId)

    const body = razorpay_order_id + "|" + razorpay_payment_id;


    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        const order = await Order.findOne({ orderId: orderId })
        order.PaymentStatus = 'Paid'
        for (const item of order.Items) {
            const updatedProduct = await Product.findByIdAndUpdate(
                item.productId,
                { $inc: { totalQuantity: -item.quantity } },
                { new: true }
            );

            if (updatedProduct.totalQuantity <= 0) {
                updatedProduct.stockStatus = 'Out of Stock';
                await updatedProduct.save();
            }
        }
        order.save()
        return res.status(200).json({
            success: true, message: 'Payment verified', paymentInfo: {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            }
        });
    } else {
        return res.status(400).json({ success: false, message: 'Invalid signature, verification failed' });
    }
}
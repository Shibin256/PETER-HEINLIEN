import Razorpay from 'razorpay'
import crypto from 'crypto'

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
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    console.log(razorpay_payment_id,'--------')

    const body = razorpay_order_id + "|" + razorpay_payment_id;


    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        // Payment is verified 
        return res.status(200).json({ success: true, message: 'Payment verified' });
    } else {
        // Verification failed 
        return res.status(400).json({ success: false, message: 'Invalid signature, verification failed' });
    }
}
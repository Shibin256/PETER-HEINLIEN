import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    addressType: { type: String, required: true },
    alternativePhone: { type: Number, required: false },
    phone: { type: Number, required: true },
    country: { type: String, default: 'india' },
    state: { type: String, required: true },
    city: { type: String, required: true },
    locality: { type: String, required: true },
    house: { type: String, required: true },
    pincode: { type: String, required: true },
}, { _id: false });

const itemSchema = new mongoose.Schema([{
    itemOrderId: { type: String, required: true },
    productId:{type:String,required:true},
    productImage: [{ type: String, required: true }],
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    subTotal: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    returnReason: { type: String, default: '' },
    returnVerified: { type: Boolean, default: false }
}, { _id: false }]);

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    Order_Address: { type: addressSchema, required: true },
    Items: { type: [itemSchema], required: true },
    TotalAmount: { type: Number, required: true },
    DeliveryCharge: { type: String, required: true },
    TotalDiscount: { type: String },
    DeliveryDate: { type: Date, required: true },
    PaymentMethod: { type: String, required: true },
    CouponName: { type: String },
    Status: { type: String, default: 'Processing' },
    OrderStatus: { type: String, default: 'Processing' },
    PaymentStatus: { type: String, default: 'Unpaid' },
    cancelReason: { type: String, default: '' },
    cancelVerified: { type: Boolean, default: false },
}, {
    timestamps: true, // Automatically handles createdAt and updatedAt
});

const Order = mongoose.model('Order', orderSchema);

export default Order;

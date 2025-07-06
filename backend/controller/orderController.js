import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";

const generateOrderId = async () => {
    const year = new Date().getFullYear();
    const count = await Order.countDocuments({ createdAt: { $gte: new Date(`${year}-01-01`) } });
    return `ORD${year}_${String(count + 1).padStart(4, '0')}`;
};


export const placeOrder = async (req, res) => {
    const { userId, address, cartItems, totalPrice, shippingCost, deliveryDate } = req.body.orderdata
    const { paymentMethod } = req.body
    const mainOrderId = await generateOrderId();
    const itemsWithIds = cartItems.map((item, index) => ({
        ...item,
        itemOrderId: `${mainOrderId}-${index + 1}`,
    }));

    const refinedAddress = {
        name: address.name,
        house: address.house,
        addressType: address.addressType,
        locality: address.locality,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        alternativePhone: address.alternativePhone,
        phone: address.phone,
    }

    const refinedItems = itemsWithIds.map(item => ({
        itemOrderId: item.itemOrderId,
        productImage: item.productId.images,
        productName: item.productId.name,
        productPrice: item.price,
        subTotal: item.productSubTotal,
        quantity: item.quantity
    }))


    console.log(refinedItems)
    const orderData = {
        UserID: userId,
        Order_Address: refinedAddress,
        Items: refinedItems,
        TotalAmount: totalPrice,
        DeliveryCharge: shippingCost,
        DeliveryDate: deliveryDate,
        PaymentMethod: paymentMethod,
        orderId: mainOrderId
    }


    console.log(orderData.Items)
    try {
        const newOrder = await Order.create(orderData);
        const product = Product.findById(cartItems[0].productId._id)
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: newOrder
        });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message
        });
    }
}


export const getOrders = async (req, res) => {
    const { userId } = req.params
    try {
        const orders = await Order.find({ UserID: userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
}

export const cancelOrderItem = async (req, res) => {
    const { itemOrderId, reason } = req.body;

    try {
        const order = await Order.findOne({ "orderId": itemOrderId });
        if (!order) {
            return res.status(404).json({ message: 'Order item not found' });
        }

        // Update item status
        order.OrderStatus = 'Cancelled';
        order.cancelReason = reason || 'No reason provided';
        await order.save();
        return res.status(200).json({ message: 'Item cancelled successfully', order });
    } catch (error) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }

}

export const verifyCancel = async (req, res) => {
    const { orderId } = req.params
    try {
        const order = await Order.findOne({ "orderId": orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        order.cancelVerified=true
        await order.save();
        return res.status(200).json({ message: 'Item verifyed successfully', order });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}
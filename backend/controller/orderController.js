import Cart from "../model/cartModal.js";
import Counter from "../model/counterModel.js";
import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";
import PDFDocument from 'pdfkit';
import logger from "../utils/logger.js";

const generateOrderId = async () => {
    const year = new Date().getFullYear();

    const counter = await Counter.findOneAndUpdate(
        { name: `order_${year}` },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    return `ORD${year}_${String(counter.seq).padStart(4, '0')}`;
};



export const placeOrder = async (req, res) => {
    const { userId, address, cartItems, totalPrice, shippingCost, deliveryDate } = req.body.orderdata
    console.log(cartItems,'cart items')
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
        productId:item.productId._id,
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
    try {
        const newOrder = await Order.create(orderData);

        // const product = Product.findById(cartItems[0].productId._id)
        const cart = await Cart.findOneAndDelete(userId)
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
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;
  const { search } = req.query;

  try {
    const matchQuery = { UserID: userId };

    if (search) {
      matchQuery["Items.productName"] = { $regex: search, $options: "i" };
    }

    const total = await Order.countDocuments(matchQuery);
    const totalPage = Math.ceil(total / limit);

    const orders = await Order.find(matchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("Items");
    return res.status(200).json({
      orders,
      total,
      page,
      totalPage
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};


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
        order.cancelVerified = true
        await order.save();
        return res.status(200).json({ message: 'Item verifyed successfully', order });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const changeOrderStatus = async (req, res) => {
    const orderId = req.params.orderId;
    const { status } = req.body;
    try {
        const order = await Order.findOne({ "orderId": orderId });
        if (!order) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        if (status == 'Delivered') {
            order.PaymentStatus = 'Paid'
        }
        order.OrderStatus = status;
        await order.save();
        return res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const getAllOrders = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const sort = req.query.sort
    const { search } = req.query;


    const filter = {};
    if (search) {
        filter['Order_Address.name'] = { $regex: search, $options: 'i' };
    }
    if (sort) {
        filter['OrderStatus'] = sort;
    }

    try {
        const total = await Order.countDocuments(filter);
        const totalPage = Math.ceil(total / limit);
        let orders = await Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('Items');

        res.status(200).json({
            orders,
            total,
            page,
            totalPage
        }
        );
    } catch (error) {
        console.error('Error fetching orders:', error);
        return res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

export const returnOrderItem = async (req, res) => {
    const { itemOrderId } = req.params;
    const { reason, deatials } = req.body;
    try {
        const orderItem = await Order.findOne({ "Items.itemOrderId": itemOrderId });
        if (!orderItem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        const UserID = orderItem.UserID;

        // Find the specific item in the order
        const item = orderItem.Items.find(item => item.itemOrderId === itemOrderId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found in order' });
        }

        // Update item status
        item.returnReason = reason || 'No reason provided';
        item.returnVerified = false; // Set to false initially
        await orderItem.save();

        const order = await Order.find({ "UserID": UserID });
        console.log(order, 'in return order item')

        return res.status(200).json({ message: 'Return request submitted successfully', order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

export const retrunVerify = async (req, res) => {
    const { itemOrderId } = req.params;
    try {
        const orderitem = await Order.findOne({ "Items.itemOrderId": itemOrderId });
        if (!orderitem) {
            return res.status(404).json({ message: 'Order item not found' });
        }
        orderitem.Items.forEach(item => {
            if (item.itemOrderId === itemOrderId) {
                item.returnVerified = true;
            }
        })
        await orderitem.save();
        const order = await Order.find().sort({ createdAt: -1 })
        return res.status(200).json({ message: 'Return request verified successfully', order });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}


export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).populate('UserID');

    if (!order) return res.status(404).json({ message: 'Order not found' });

    const doc = new PDFDocument({ margin: 50 });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderId}.pdf`);
    doc.pipe(res);

    // === HEADER ===
    doc.fontSize(24).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
    doc.moveDown(1);

    // === ORDER DETAILS ===
    doc.fontSize(12).font('Helvetica-Bold').text('Order Summary:', { underline: true });
    doc.moveDown(0.5);
    doc.font('Helvetica').text(`Order ID: ${order.orderId}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Customer: ${order.UserID.username || 'N/A'}`);
    doc.text(`Payment Method: ${order.PaymentMethod}`);
    doc.text(`Payment Status: ${order.PaymentStatus}`);
    doc.moveDown();

    // === ADDRESS ===
    const addr = order.Order_Address;
    doc.font('Helvetica-Bold').text('Delivery Address:', { underline: true });
    doc.moveDown(0.5);
    doc.font('Helvetica').text(`${addr.name}`);
    doc.text(`${addr.house}(ho), ${addr.city}`);
    doc.text(`${addr.state}, ${addr.country},- ${addr.pincode}(pin)`);
    doc.moveDown();

    // === ITEMS TABLE ===
    doc.font('Helvetica-Bold').text('Items:', { underline: true });
    doc.moveDown(0.5);

    // Table Header
    doc.font('Helvetica-Bold');
    doc.text('No.', 50, doc.y, { continued: true });
    doc.text('Item', 90, doc.y, { continued: true });
    doc.text('Qty', 300, doc.y, { continued: true });
    doc.text('Price', 350, doc.y, { continued: true });
    doc.text('Subtotal', 380);
    doc.moveDown(0.3);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(0.5);

    // Table Rows
    doc.font('Helvetica');
    order.Items.forEach((item, idx) => {
      doc.text(`${idx + 1}`, 50, doc.y, { continued: true });
      doc.text(`${item.productName}`, 90, doc.y, { continued: true });
      doc.text(`${item.quantity}`, 300, doc.y, { continued: true });
      doc.text(`Rs.${item.productPrice}`, 350, doc.y, { continued: true });
      doc.text(`Rs.${item.subTotal}`, 380);
    });

    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // === AMOUNTS ===
    doc.font('Helvetica-Bold');
    doc.text(`Delivery Charge: Rs.${order.DeliveryCharge}`, { align: 'right' });
    doc.text(`Total Amount: Rs.${order.TotalAmount}`, { align: 'right' });

    // === FOOTER ===
    doc.moveDown(2);
    doc.fontSize(10).font('Helvetica-Oblique').text('Thank you for shopping with us!', {
      align: 'center',
    });

    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating invoice' });
  }
};

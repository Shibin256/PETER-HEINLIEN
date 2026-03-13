import Cart from '../model/cartModal.js';
import Counter from '../model/counterModel.js';
import Order from '../model/orderModel.js';
import Product from '../model/productModel.js';
import PDFDocument from 'pdfkit';
import Wallet from '../model/walletModal.js';
import { v4 as uuidv4 } from 'uuid';
import User from '../model/userModel.js';
import { MESSAGES } from '../utils/messages.js';
import Coupons from '../model/couponsModal.js';

const generateOrderId = async () => {
  const year = new Date().getFullYear();

  const counter = await Counter.findOneAndUpdate(
    { name: `order_${year}` },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  return `ORD${year}_${String(counter.seq).padStart(4, '0')}`;
};

export const placeOrder = async (req, res) => {
  try {
    const {
      userId,
      address,
      cartItems,
      appliedCoupon,
      totalPrice,
      shippingCost,
      deliveryDate,
    } = req.body.orderdata;

    const { paymentMethod } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: MESSAGES.USER_NOTFOUND });
    }

    const hasCoupon = appliedCoupon && appliedCoupon.code;


    let productTotal = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      const product = await Product.findById(item.productId._id);

      if (!product) {
        return res
          .status(400)
          .json({ message: `Product not found ${item.productId._id}` });
      }

      if (item.quantity > product.totalQuantity) {
        return res
          .status(400)
          .json({ message: `${product.name} is out of stock` });
      }

      const currentPrice = product.offerPrice || product.price;

      if (item.price !== currentPrice) {
        return res.status(400).json({
          message: `Price changed for ${product.name}. Please refresh cart.`,
        });
      }

      const subTotal = currentPrice * item.quantity;
      productTotal += subTotal;

      validatedItems.push({
        product,
        quantity: item.quantity,
        price: currentPrice,
        subTotal,
      });
    }


    let totalCouponDiscount = 0;

    if (hasCoupon) {
      totalCouponDiscount = productTotal - totalPrice;
      if (totalCouponDiscount < 0) totalCouponDiscount = 0;
    }


    const mainOrderId = await generateOrderId();


    const refinedItems = validatedItems.map((item, index) => {
      let couponShare = 0;

      if (hasCoupon && productTotal > 0) {
        couponShare =
          (item.subTotal / productTotal) * totalCouponDiscount;
      }

      return {
        itemOrderId: `${mainOrderId}-${index + 1}`,
        productId: item.product._id,
        productImage: item.product.images,
        productName: item.product.name,
        productPrice: item.price,
        subTotal: item.subTotal,
        quantity: item.quantity,
        couponDiscount: Math.round(couponShare),
      };
    });


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
    };


    const orderData = {
      orderId: mainOrderId,
      UserID: userId,
      Order_Address: refinedAddress,
      Items: refinedItems,
      TotalAmount: totalPrice,
      DeliveryCharge: shippingCost,
      DeliveryDate: deliveryDate,
      PaymentMethod: paymentMethod,
      CouponName: hasCoupon ? appliedCoupon.code : "",
      TotalDiscount: totalCouponDiscount,
    };

    const newOrder = await Order.create(orderData);


    for (const item of refinedItems) {
      const updatedProduct = await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { totalQuantity: -item.quantity } },
        { new: true }
      );

      if (updatedProduct.totalQuantity <= 0) {
        updatedProduct.stockStatus = "Out of Stock";
        await updatedProduct.save();
      }
    }


    if (paymentMethod === "razorpay") {
      newOrder.PaymentStatus = "Failed";
      newOrder.OrderStatus = "Failed";
      await newOrder.save();
    }

    if (paymentMethod !== 'razorpay' && hasCoupon) {
      let coupon = await Coupons.findOne({ code: appliedCoupon.code }).select('-createdAt -update')

      coupon.usageLimit -= 1;
      coupon.usersUsed.push(userId);
      await coupon.save();
    }

    if (paymentMethod === "walletPay") {
      const wallet = await Wallet.findOne({ userId });

      wallet.balance -= totalPrice + shippingCost;

      wallet.transactions.push({
        userId,
        amount: totalPrice + shippingCost,
        paymentId: `WALLET-${Date.now()}`,
        status: "success",
        type: "debit",
        description: "Purchase Through Wallet",
      });

      await wallet.save();

      newOrder.PaymentStatus = "Paid";
      await newOrder.save();
    }


    await Cart.findOneAndDelete({ userId });

    return res.status(201).json({
      success: true,
      message: MESSAGES.ORDER_PLACED,
      order: newOrder,
    });

  } catch (error) {
    console.error("Place Order Error:", error);
    return res.status(500).json({
      success: false,
      message: MESSAGES.FAILD_PLACEORDER,
      error: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;
  const skip = (page - 1) * limit;
  const { search } = req.query;

  try {
    const matchQuery = { UserID: userId };

    if (search) {
      matchQuery['Items.productName'] = { $regex: search, $options: 'i' };
    }

    const total = await Order.countDocuments(matchQuery);
    const totalPage = Math.ceil(total / limit);

    const orders = await Order.find(matchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('Items');
    return res.status(200).json({
      orders,
      total,
      page,
      totalPage,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};


export const cancelOrderItem = async (req, res) => {
  const { itemOrderId, reason } = req.body;

  try {
    const order = await Order.findOne({ orderId: itemOrderId }).select(
      '-createdAt -updatedAt'
    );

    if (!order) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    // Restore product stock
    for (const item of order.Items) {
      const updatedProduct = await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { totalQuantity: +item.quantity } },
        { new: true }
      ).select('-createdAt -updatedAt');

      if (updatedProduct.totalQuantity >= 1) {
        updatedProduct.stockStatus = 'In Stock';
        await updatedProduct.save();
      }
    }

    // Update order status
    order.OrderStatus = 'Cancelled';
    order.cancelReason = reason || 'No reason provided';
    order.PaymentStatus = 'Refunded'
    await order.save();

    if (order.PaymentMethod !== 'cod') {

      const total =
        Number(order.TotalAmount) + Number(order.DeliveryCharge || 0);

      let wallet = await Wallet.findOne({ userId: order.UserID });

      const transaction = {
        userId: order.UserID,
        amount: total,
        paymentId: `REFUND-${Date.now()}-${uuidv4().slice(0, 8)}`,
        status: 'success',
        type: 'credit',
        description: 'Order Cancelled Refund',
      };
      if (wallet) {
        wallet.balance += total;
        wallet.transactions.push(transaction);
      } else {
        wallet = new Wallet({
          userId: order.UserID,
          balance: total,
          transactions: [transaction],
        });
      }

      await wallet.save();
    }

    return res
      .status(200)
      .json({ message: 'Item cancelled and refund processed', order });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const cancelOrderSingleItem = async (req, res) => {
  const { itemOrderId, reason } = req.body;

  try {
    const orderItem = await Order.findOne({
      'Items.itemOrderId': itemOrderId,
    }).select('-createdAt -updatedAt');

    if (!orderItem) {
      return res.status(404).json({ message: 'Order item not found' });
    }

    const UserID = orderItem.UserID;

    const item = orderItem.Items.find(
      (item) => item.itemOrderId === itemOrderId,
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found in order' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      item.productId,
      { $inc: { totalQuantity: +item.quantity } },
      { new: true },
    ).select('-createdAt -updatedAt');

    if (updatedProduct.totalQuantity >= 1) {
      updatedProduct.stockStatus = 'In Stock';
      await updatedProduct.save();
    }

    item.cancelReason = reason || 'No reason provided';
    item.status = 'Cancelled';

    if (orderItem.Items.length == 1) {
      orderItem.OrderStatus = 'Cancelled';
      orderItem.PaymentStatus = 'Refunded';
    }

    await orderItem.save();
    if (orderItem.Items.every(item => item.cancelReason)) {
      orderItem.OrderStatus = 'Cancelled';
      orderItem.PaymentStatus = 'Refunded';
      orderItem.save()
    }


    if (orderItem.PaymentMethod !== 'cod') {
      const refundAmount = Number(item.productPrice) * Number(item.quantity) - item.couponDiscount;
      let wallet = await Wallet.findOne({ userId: UserID });

      const transaction = {
        userId: UserID,
        amount: refundAmount,
        paymentId: `REFUND-${Date.now()}-${uuidv4().slice(0, 8)}`,
        status: 'success',
        type: 'credit',
        description: 'Single Item Cancelled Refund',
      };

      if (wallet) {
        wallet.balance += refundAmount;
        wallet.transactions.push(transaction);
      } else {
        wallet = new Wallet({
          userId: UserID,
          balance: refundAmount,
          transactions: [transaction],
        });
      }

      await wallet.save();
    }

    const order = await Order.find({ UserID: UserID }).select(
      '-createdAt -updatedAt',
    );

    return res
      .status(200)
      .json({ message: 'Item cancelled and refund processed', order });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const singleCancelVerify = async (req, res) => {
  const { itemOrderId } = req.params;
  try {
    let total = 0;
    const orderitem = await Order.findOne({ 'Items.itemOrderId': itemOrderId });
    if (!orderitem) {
      return res.status(404).json({ message: 'Order item not found' });
    }
    orderitem.Items.forEach((item) => {
      if (item.itemOrderId === itemOrderId) {
        item.cancelVerified = true;
        total = item.productPrice;
      }
    });

    await orderitem.save();

    if (orderitem.PaymentMethod != 'cod') {
      let wallet = await Wallet.findOne({ userId: orderitem.UserID });
      const transactions = {
        userId: orderitem.UserID,
        amount: total,
        paymentId: `REFUND-${Date.now()}-${uuidv4().slice(0, 8)}`,
        status: 'success',
        type: 'credit',
        description: 'Order Canceled Refund',
      };

      if (wallet) {
        wallet.balance += total;
        wallet.transactions.push(transactions);
      } else {
        wallet = new Wallet({
          userId: orderitem.UserID,
          balance: total,
          transactions: [transactions],
        });
      }
      await wallet.save();
    }

    const order = await Order.find()
      .sort({ createdAt: -1 })
      .select('-createdAt -updatedAt');
    return res
      .status(200)
      .json({ message: 'Return request verified successfully', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

export const verifyCancel = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findOne({ orderId: orderId });
    if (!order) {
      return res.status(404).json({ message: MESSAGES.ORDER_ITEM_NOTFOUND });
    }

    let total = Number(order.TotalAmount) + Number(order.DeliveryCharge);

    order.cancelVerified = true;
    await order.save();

    if (order.PaymentMethod != 'cod') {
      let wallet = await Wallet.findOne({ userId: order.UserID });

      const transactions = {
        userId: order.UserID,
        amount: total,
        paymentId: `REFUND-${Date.now()}-${uuidv4().slice(0, 8)}`,
        status: 'success',
        type: 'credit',
        description: 'Order Canceled Refund',
      };

      if (wallet) {
        wallet.balance += total;
        wallet.transactions.push(transactions);
      } else {
        wallet = new Wallet({
          userId: order.UserID,
          balance: total,
          transactions: [transactions],
        });
      }
      await wallet.save();
    }

    return res
      .status(200)
      .json({ message: 'Item verifyed successfully', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

export const changeOrderStatus = async (req, res) => {
  const orderId = req.params.orderId;
  const { status } = req.body;
  try {
    const order = await Order.findOne({ orderId: orderId }).select(
      '-createdAt -updatedAt',
    );
    if (!order) {
      return res.status(404).json({ message: MESSAGES.ORDER_ITEM_NOTFOUND });
    }
    if (status == 'Delivered') {
      order.PaymentStatus = 'Paid';
    }
    order.OrderStatus = status;
    await order.save();
    return res
      .status(200)
      .json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: MESSAGES.ORDER_ITEM_NOTFOUND });
  }
};

export const updateStatusAfterRazorpay = async (req, res) => {
  const orderId = req.params.itemId

  try {
    const order = await Order.findOne({ orderId: orderId }).select('-createdAt -updatedAt')
    if (!order) {
      return res.status(404).json({ message: MESSAGES.ORDER_ITEM_NOTFOUND });
    }

    for (const item of order.Items) {
      const updatedProduct = await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { totalQuantity: +item.quantity } },
        { new: true },
      );

      if (updatedProduct.totalQuantity > 0) {
        updatedProduct.stockStatus = 'In Stock';
        await updatedProduct.save();
      }
    }
    return res
      .status(200)
      .json({ message: 'status updated' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: MESSAGES.ORDER_ITEM_NOTFOUND })
  }


}

export const checkAvailablity = async (req, res) => {
  const orderId = req.params.itemId
  try {
    const order = await Order.findOne({ orderId: orderId }).select('-createdAt -updatedAt')
    if (!order) {
      return res.status(404).json({ message: MESSAGES.ORDER_ITEM_NOTFOUND });
    }
    if (order.CouponName) {
      const coupon = await Coupons.findOne({ code: order.CouponName }).select('-createdAt -updatedAt',)
      if (!coupon) {
        return res.status(404).json({ message: 'The coupon you applied not exists anymore' });
      }
      if (coupon.usageLimit <= 0) {
        return res.status(400).json({ message: 'Coupon usage limit exceeded Please order Once again' });
      }
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return res.status(400).json({ message: `The coupon you applied for this order has ${MESSAGES.COUPON_EXPIRED}` });
      }
      if ((coupon.usersUsed || []).some((user) => user.toString() === order.UserID.toString())) {
        return res
          .status(500)
          .json({ message: 'You have already used the coupon you applied for this order' });
      }
    }

    for (const item of order.Items) {
      const updatedProduct = await Product.findById(item.productId);
      if (updatedProduct.totalQuantity <= 0) {
        return res.status(500).json({ message: 'Product out of stoke' })
      }
    }

    return res.status(200).json({ message: '' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: MESSAGES.ORDER_ITEM_NOTFOUND })
  }
}

export const getAllOrders = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;
  const sort = req.query.sort;
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
    let orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('Items')
      .select('-updatedAt');

    res.status(200).json({
      orders,
      total,
      page,
      totalPage,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

export const returnOrderItem = async (req, res) => {
  const { itemOrderId } = req.params;
  const { reason } = req.body;
  try {
    const orderItem = await Order.findOne({
      'Items.itemOrderId': itemOrderId,
    }).select('-createdAt -updatedAt');
    if (!orderItem) {
      return res.status(404).json({ message: MESSAGES.ORDER_ITEM_NOTFOUND });
    }
    const UserID = orderItem.UserID;

    // Find the specific item in the order
    const item = orderItem.Items.find(
      (item) => item.itemOrderId === itemOrderId,
    );
    if (!item) {
      return res.status(404).json({ message: MESSAGES.ITEM_NOT_NOTFOUND });
    }


    item.returnReason = reason || 'No reason provided';
    item.returnVerified = false;
    await orderItem.save();

    const order = await Order.find({ UserID: UserID });

    return res
      .status(200)
      .json({ message: 'Return request submitted successfully', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

export const retrunVerify = async (req, res) => {
  const { itemOrderId } = req.params;
  try {
    let total = 0;
    const orderitem = await Order.findOne({
      'Items.itemOrderId': itemOrderId,
    }).select('-createdAt -updatedAt');
    if (!orderitem) {
      return res.status(404).json({ message: MESSAGES.ORDER_ITEM_NOTFOUND });
    }
    orderitem.Items.forEach((item) => {
      if (item.itemOrderId === itemOrderId) {
        item.returnVerified = true;
        total = item.productPrice;
      }
    });
    await orderitem.save();

    if (orderitem.PaymentMethod != 'cod') {
      let wallet = await Wallet.findOne({ userId: orderitem.UserID });

      const transactions = {
        userId: orderitem.UserID,
        amount: total,
        paymentId: `REFUND-${Date.now()}-${uuidv4().slice(0, 8)}`,
        status: 'success',
        type: 'credit',
        description: 'Order Canceled Refund',
      };

      if (wallet) {
        wallet.balance += total;
        wallet.transactions.push(transactions);
      } else {
        wallet = new Wallet({
          userId: orderitem.UserID,
          balance: total,
          transactions: [transactions],
        });
      }
      await wallet.save();
    }

    const order = await Order.find()
      .sort({ createdAt: -1 })
      .select('-createdAt -updatedAt');
    return res
      .status(200)
      .json({ message: 'Return request verified successfully', order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
export const rejectReturn = async (req, res) => {
  const { itemOrderId } = req.params;

  try {
    const order = await Order.findOne({
      'Items.itemOrderId': itemOrderId,
    }).select('-createdAt -updatedAt');

    if (!order) {
      return res
        .status(404)
        .json({ message: MESSAGES.ORDER_ITEM_NOTFOUND });
    }

    order.Items.forEach((item) => {
      if (item.itemOrderId === itemOrderId) {
        item.returnReason = 'return rejected';
        item.returnVerified = true;   // optional (based on your flow)
      }
    });

    await order.save();

    const updatedOrders = await Order.find()
      .sort({ createdAt: -1 })
      .select('-createdAt -updatedAt');

    return res.status(200).json({
      message: 'Return request rejected successfully',
      order: updatedOrders,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

export const downloadInvoice = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId })
      .populate('UserID')
      .select('-updatedAt');

    if (!order)
      return res.status(404).json({ message: MESSAGES.ORDER_ITEM_NOTFOUND });

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=invoice-${order.orderId}.pdf`
    );

    doc.pipe(res);

    // HEADER  

    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('INVOICE', { align: 'center' });

    doc.moveDown();

    //  ORDER SUMMARY  

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Order Summary:', { underline: true });

    doc.moveDown(0.5);

    doc.font('Helvetica');

    doc.text(`Order ID: ${order.orderId}`);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
    doc.text(`Customer: ${order.UserID?.username || 'N/A'}`);
    doc.text(`Payment Method: ${order.PaymentMethod}`);
    doc.text(`Payment Status: ${order.PaymentStatus}`);

    doc.moveDown();

    // ADDRESS  

    const addr = order.Order_Address;

    doc.font('Helvetica-Bold').text('Delivery Address:', { underline: true });

    doc.moveDown(0.5);

    doc.font('Helvetica');

    doc.text(addr?.name || '');
    doc.text(`${addr?.house || ''}, ${addr?.city || ''}`);
    doc.text(`${addr?.state || ''}, ${addr?.country || ''} - ${addr?.pincode || ''}`);

    doc.moveDown();

    //  ITEMS TABLE  

    doc.font('Helvetica-Bold').text('Items:', { underline: true });

    doc.moveDown(0.5);

    const tableTop = doc.y;

    doc.font('Helvetica-Bold');

    doc.text('No.', 50, tableTop, { width: 40 });
    doc.text('Item', 90, tableTop, { width: 190 });
    doc.text('Qty', 280, tableTop, { width: 50, align: 'center' });
    doc.text('Price', 330, tableTop, { width: 80, align: 'right' });
    doc.text('Subtotal', 410, tableTop, { width: 100, align: 'right' });

    doc.moveTo(50, tableTop + 18).lineTo(550, tableTop + 18).stroke();

    doc.moveDown();

    // ROWS 

    doc.font('Helvetica');

    order.Items.forEach((item, idx) => {
      const y = doc.y;

      if (y > 730) {
        doc.addPage();
      }

      doc.text(`${idx + 1}`, 50, y, {
        width: 40,
        lineBreak: false,
      });

      doc.text(item.productName, 90, y, {
        width: 190,
        ellipsis: true,
        lineBreak: false,
      });

      doc.text(`${item.quantity}`, 280, y, {
        width: 50,
        align: 'center',
        lineBreak: false,
      });

      doc.text(`Rs.${Number(item.productPrice).toFixed(2)}`, 330, y, {
        width: 80,
        align: 'right',
        lineBreak: false,
      });

      doc.text(`Rs.${Number(item.subTotal).toFixed(2)}`, 410, y, {
        width: 100,
        align: 'right',
      });

      doc.moveDown();
    });

    // TOTAL SECTION  

    doc.moveDown();

    doc.moveTo(350, doc.y).lineTo(550, doc.y).stroke();

    doc.moveDown(0.5);

    doc.font('Helvetica');

    doc.text(
      `Delivery Charge: Rs.${Number(order.DeliveryCharge).toFixed(2)}`,
      350,
      doc.y,
      { width: 200, align: 'right' }
    );

    doc.moveDown(0.5);

    doc.font('Helvetica-Bold');

    doc.text(
      `Grand Total Paid: Rs.${Number(order.TotalAmount).toFixed(2)}`,
      350,
      doc.y,
      { width: 200, align: 'right' }
    );


    doc.moveDown(2);
    // Footer
    doc
      .fontSize(10)
      .font('Helvetica-Oblique')
      .text('Thank you for shopping with us!', { align: 'center' })
      .text('Peter-Heinlien.Ltd', { align: 'center' });


    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error generating invoice' });
  }
};

export const addReview = async (req, res) => {
  const { itemId } = req.params;
  const { rating, review } = req.body;

  try {
    const orderItem = await Order.findOne({
      'Items.itemOrderId': itemId,
    }).select('-createdAt -updatedAt');

    if (!orderItem) {
      return res.status(404).json({ message: MESSAGES.ORDER_ITEM_NOTFOUND });
    }

    const userID = orderItem.UserID;

    const item = orderItem.Items.find((item) => item.itemOrderId === itemId);
    if (!item) {
      return res.status(404).json({ message: MESSAGES.ITEM_NOT_NOTFOUND });
    }

    item.rated = true;
    item.rating = rating;
    item.comment = review;

    const productId = item.productId;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: MESSAGES.ITEM_NOT_NOTFOUND });
    }

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === userID.toString(),
    );

    if (alreadyReviewed) {
      alreadyReviewed.rating = rating;
      alreadyReviewed.comment = review;
    } else {
      const productReview = {
        user: userID,
        rating: Number(rating),
        comment: review,
      };
      product.reviews.push(productReview);
    }

    product.numReviews = product.reviews.length;

    product.averageRating =
      product.reviews.reduce((acc, r) => r.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    await orderItem.save();

    res.status(200).json({ message: 'Review added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

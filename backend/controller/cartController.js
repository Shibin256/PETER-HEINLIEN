import Cart from "../model/cartModal.js"
import Product from "../model/productModel.js"
import wishlistModel from "../model/wishlistModel.js";

// Add to cart
export const addItemToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.totalQuantity <= 0) return res.status(400).json({ message: 'Product is out of stock' });

    const wishlist = await wishlistModel.findOne({ userId })
    if (wishlist) {
      wishlist.productIds = wishlist.productIds.filter(id => id.toString() !== productId);
      await wishlist.save();
      console.log('Product removed from wishlist')
    }


    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [],
        subTotal: 0,
        totalPrice: 0
      });
    }

    const existingItem = cart.products.find(
      item => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.productSubTotal = existingItem.quantity * existingItem.price;
    } else {
      cart.products.push({
        productId,
        quantity,
        price: product.price,
        productSubTotal: product.price * quantity
      });
    }

    cart.subTotal = cart.products.reduce((acc, item) => acc + item.productSubTotal, 0);
    cart.totalPrice = cart.subTotal;

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate('products.productId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product quantity
export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);
    
    if (product.totalQuantity <= 0) return res.status(400).json({ message: 'Product is out of stock' });

    if (quantity > product.totalQuantity) return res.status(400).json({ message: 'max quantity added' });

    if (!cart) return res.status(404).json({ message: 'Cart not found' });


    const item = cart.products.find(p => p.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Product not in cart' });

    item.quantity = quantity;
    item.productSubTotal = item.price * quantity;

    cart.subTotal = cart.products.reduce((acc, item) => acc + item.productSubTotal, 0);
    cart.totalPrice = cart.subTotal;

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Remove product
export const removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    console.log(userId, productId)

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter(p => p.productId.toString() !== productId);

    cart.subTotal = cart.products.reduce((acc, item) => acc + item.productSubTotal, 0);
    cart.totalPrice = cart.subTotal;

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
import Cart from "../model/cartModal.js"
import Product from "../model/productModel.js"
import wishlistModel from "../model/wishlistModel.js";

// Add to cart
export const addItemToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const product = await Product.findById(productId).select('-createdAt -updatedAt');

    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.totalQuantity <= 0) return res.status(400).json({ message: 'Product is out of stock' });

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
      if (existingItem.quantity >= 4) return res.status(400).json({ message: 'max quantity added' });
      console.log(quantity)
      if (existingItem.quantity >= product.totalQuantity) {
        return res.status(400).json({ message: `Product is out of stock` });
      }

      existingItem.quantity += quantity;
      existingItem.productSubTotal = existingItem.quantity * existingItem.price;
    } else {
      if (quantity > product.totalQuantity) {
        return res.status(400).json({ message: 'Not enough stock available' });
      }

      cart.products.push({
        productId,
        quantity,
        price: product.price,
        productSubTotal: product.price * quantity
      });
    }

    const wishlist = await wishlistModel.findOne({ userId })
    if (wishlist) {
      wishlist.productIds = wishlist.productIds.filter(id => id.toString() !== productId);
      await wishlist.save();
      console.log('Product removed from wishlist')
    }


    cart.subTotal = cart.products.reduce((acc, item) => acc + item.productSubTotal, 0);
    cart.totalPrice = cart.subTotal;

    await cart.save();
    // product.totalQuantity -= quantity;
    await product.save();

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get cart
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate('products.productId').select('-createdAt -updatedAt');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    console.log(cart)
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleIsLocked = async (req, res) => {
  try {
    const { userId, lock } = req.params;
    console.log(userId, lock,'in controller')

    const cart = await Cart.findOne({ userId: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    if (lock == 'true') {
      cart.isLocked = true;
    } else {
      cart.isLocked = false;
    }

    await cart.save();
    res.status(200).json({
      message: lock ? "Cart locked for payment" : "Cart unlocked",
      cart
    });

  } catch (error) {
    console.error("Error in toggleIsLocked:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export const updateCartItem = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cart = await Cart.findOne({ userId }).select('-createdAt -updatedAt');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const product = await Product.findById(productId).select('-createdAt -updatedAt');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    console.log('product0==', product)
    if (quantity > product.totalQuantity) {
      return res.status(400).json({ message: `Cannot add more. Only ${product.totalQuantity} item(s) in stock.` });
    }

    const item = cart.products.find(p => p.productId.toString() === productId);
    if (!item) return res.status(404).json({ message: 'Product not in cart' });

    const oldQuantity = item.quantity;
    const quantityDifference = quantity - oldQuantity;

    // Check stock if increasing quantity
    if (quantityDifference > 0 && quantityDifference > product.totalQuantity) {
      return res.status(400).json({ message: `Only ${product.totalQuantity} item(s) left in stock` });
    }

    // Limit max quantity per item (optional)
    if (quantity > 4) {
      return res.status(400).json({ message: 'Max 4 units allowed per item' });
    }

    // Update product stock
    // product.totalQuantity -= quantityDifference;
    if (product.totalQuantity < 0) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    // Update cart item
    item.quantity = quantity;
    item.productSubTotal = item.price * quantity;

    // Recalculate totals
    cart.subTotal = cart.products.reduce((acc, item) => acc + item.productSubTotal, 0);
    cart.totalPrice = cart.subTotal;

    await cart.save();
    await product.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Failed to update cart item' });
  }
};



// Remove product
export const removeCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const product = await Product.findById(productId).select('-createdAt -updatedAt');
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = await Cart.findOne({ userId }).select('-createdAt -updatedAt');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.products = cart.products.filter(p => p.productId.toString() !== productId);

    cart.subTotal = cart.products.reduce((acc, item) => acc + item.productSubTotal, 0);
    cart.totalPrice = cart.subTotal;

    // product.totalQuantity += quantity;
    await product.save();
    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addFromWishlistToCart = async (req, res) => {
  const { userId, productIds, quantity = 1 } = req.body;
  if (!Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ message: 'No product IDs provided' });
  }

  try {
    let cart = await Cart.findOne({ userId: userId }).select('-createdAt -updatedAt');

    if (!cart) {
      cart = new Cart({
        userId: userId,
        products: [],
        subTotal: 0,
        totalPrice: 0,
      });
    }

    const products = await Product.find({
      _id: { $in: productIds },
      isList: { $ne: true },
    });


    for (const product of products) {
      console.log(product)
      if (product.totalQuantity <= 0) {
        return res.status(400).json({ message: `${product.name} is out of stock` });
      }

      const existingItem = cart.products.find(
        item => item.productId.toString() === product._id.toString()
      );

      if (existingItem) {
        if (existingItem.quantity >= 4) {
          return res.status(400).json({ message: 'Max quantity reached for one item' });
        }
        if (product.totalQuantity <= 0) {
          return res.status(400).json({ message: 'Not enough stock available' });
        }

        existingItem.quantity += quantity;
        existingItem.productSubTotal = existingItem.quantity * existingItem.price;
      } else {
        if (quantity > product.totalQuantity) {
          return res.status(400).json({ message: 'Not enough stock available' });
        }
        cart.products.push({
          productId: product._id,
          quantity,
          price: product.price,
          productSubTotal: product.price * quantity,
        });
      }
      await product.save();
    }
    // Remove products from wishlist
    const wishlist = await wishlistModel.findOne({ userId });
    if (wishlist) {
      wishlist.productIds = wishlist.productIds.filter(
        id => !productIds.includes(id.toString())
      );
      await wishlist.save();
    }

    // Recalculate total
    cart.subTotal = cart.products.reduce((acc, item) => acc + item.productSubTotal, 0);
    cart.totalPrice = cart.subTotal;

    await cart.save();

    return res.status(200).json({
      message: 'Wishlist products added to cart successfully',
      cart,
    });
  } catch (error) {
    console.error('Error adding wishlist to cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


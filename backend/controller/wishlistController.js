// controllers/wishlistController.js
import Wishlist from '../model/wishlistModel.js';

//add items to wish list
export const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, productIds: [productId] });
    } else {
      if (!wishlist.productIds.includes(productId)) {
        wishlist.productIds.push(productId);
      }
    }

    await wishlist.save();
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
};

// removing products from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const wishlist = await Wishlist.findOne({ userId });
    if (wishlist) {
      wishlist.productIds = wishlist.productIds.filter(id => id.toString() !== productId);
      await wishlist.save();
    }
    res.status(200).json({ message: 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
};

// wishlist products getting
export const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.params;

    const wishlist = await Wishlist.findOne({ userId }).populate('productIds');
    console.log(wishlist.productIds)

    res.status(200).json(wishlist?.productIds || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
};


// getting single products to check whishlisted or not 
export const getWishedProduct = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    // Find the wishlist for the user
    const wishlist = await Wishlist.findOne({ userId });

    // Check if the product exists in the wishlist
    const isWished = wishlist?.productIds?.some(
      (id) => id.toString() === productId
    );

    if (isWished) {
      res.status(200).json({ wished: true });
    } else {
      res.status(200).json({ wished: false });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to check wishlist product' });
  }
};

import Wallet from "../model/walletModal.js";

export const addToWallet = async (req, res) => {
  const { userId, amount, paymentId } = req.params;
  console.log(paymentId, 'in the walet')

  const numericAmount = parseFloat(amount);

  if (isNaN(numericAmount) || numericAmount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    let wallet = await Wallet.findOne({ userId });

    const transactions = {
      userId,
      amount: numericAmount,
      paymentId,
      status: 'success',
      type: 'credit',
      description: 'Wallet Top-up'
    }

    if (wallet) {
      wallet.balance += numericAmount;
      wallet.transactions.push(transactions)
    } else {
      wallet = new Wallet({ userId, balance: numericAmount, transactions: [transactions] });
    }

    await wallet.save();
    res.status(200).json({ message: 'Wallet updated', wallet });
  } catch (error) {
    console.error('Error adding to wallet:', error);
    res.status(500).json({ message: 'Failed to update wallet' });
  }
};



export const getWallet = async (req, res) => {
  const { userId } = req.params;
  console.log(userId,'----')
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    const total = wallet.transactions.length;
    const totalPage = Math.ceil(total / limit);

    const transactions = [...wallet.transactions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(skip, skip + limit);

    res.status(200).json({
      wallet: {
        _id: wallet._id,
        userId: wallet.userId,
        balance: wallet.balance,
        transactions,
      },
      total,
      page,
      totalPage,
    });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return res.status(500).json({ message: "Failed to fetch wallet" });
  }
};



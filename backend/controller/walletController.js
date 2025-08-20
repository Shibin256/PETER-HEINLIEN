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
  const { userId } = req.params

  const wallet = await Wallet.findOne({ userId }).sort({ createdAt: -1 })
  wallet.transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  console.log(wallet, '---- in the wallet page')
  res.status(200).json({ wallet });
}


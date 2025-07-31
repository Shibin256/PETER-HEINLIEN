import React, { useEffect, useState } from 'react';
import Title from '../../components/common/Title';
import { createPaymentOrder, verifyPayment } from '../../features/orders/ordersSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToWallet, getWallet } from '../../features/wallet/walletSlice';
const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID


const Wallet = () => {
    const [amount, setAmount] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [transactions, setTransactions] = useState([]);
    const [paymentId, setPaymentId] = useState('')
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsModalOpen(false);
        setAmount('');
    };


    useEffect(() => {
        const script = document.createElement('script')
        script.src = 'https://checkout.razorpay.com/v1/checkout.js'
        script.async = true;
        document.body.appendChild(script);
    }, [])

    useEffect(() => {
        dispatch(getWallet(user._id))
    }, [])

    const { walletAmount, loading, transactions } = useSelector(state => state.wallet)


    const handlePayments = async (amount) => {
        try {
            const result = await dispatch(createPaymentOrder(amount)).unwrap();
            const { order } = result;

            return new Promise((resolve, reject) => {
                const options = {
                    key: razorpayKey,
                    amount: order.amount,
                    currency: order.currency,
                    name: "Peter Heinlien Watches",
                    description: "Watch Order",
                    order_id: order.id,
                    handler: async (response) => {
                        try {
                            setPaymentId(response.razorpay_payment_id)
                            console.log(paymentId, '-------')
                            const verifyRes = await dispatch(verifyPayment(response)).unwrap();
                            if (verifyRes.success) {
                                resolve(true);
                            } else {
                                reject("Payment verification failed");
                            }
                        } catch (err) {
                            reject("Payment verification error");
                        }
                    },
                    prefill: {
                        name: "Customer Name",
                        email: "customer@example.com",
                        contact: "9999999999"
                    },
                    theme: {
                        color: "#3399cc"
                    },
                    modal: {
                        ondismiss: () => {
                            reject("Payment was cancelled by user");
                        }
                    },
                    retry: {
                        enabled: false // disables auto retry popup
                    }
                };

                const rzp = new window.Razorpay(options);

                rzp.on("payment.failed", function (response) {
                    const errorMessage = response.error?.description || "Payment failed due to an error.";
                    reject(errorMessage);
                });

                rzp.open();
            });

        } catch (err) {
            console.error("Razorpay init failed:", err);
            return false;
        }
    };


    const handleAmountChange = (e) => setAmount(e.target.value);

    const handlePayment = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            toast.warning('Please enter a valid amount');
            return;
        }
        const paymentSuccess = await handlePayments({ totalPrice: amount })
        if (paymentSuccess) {
            console.log(paymentId, 'in the walletjs')
            await dispatch(addToWallet({ userId: user._id, amount: amount, paymentId: paymentId }))
        }

        setIsModalOpen(false)
        setAmount('')

    };

    return (
        <div className="container mx-auto p-4 md:p-8 min-h-screen bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe]">
            {/* Header */}
            <div className="mb-8">
                <Title text1={'My'} text2={'Wallet'} />
                <p className="text-[#527a85] mt-2">Manage your funds and transactions</p>
            </div>

            {/* Wallet Balance Card */}
            <div className="bg-gradient-to-r from-[#003543] to-[#005662] rounded-2xl shadow-xl p-6 mb-8 text-white transform transition-all hover:scale-[1.01] duration-300">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-lg font-medium mb-1">Available Balance</h2>
                        <p className="text-4xl font-bold">₹{walletAmount.toFixed(2)}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                </div>
                <button
                    onClick={openModal}
                    className="mt-6 bg-white text-[#003543] px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg w-full md:w-auto"
                >
                    Add Funds
                </button>
            </div>


            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
                {/* Header */}
                <div className="p-6 border-b border-[#e6f0f3]">
                    <h2 className="text-xl font-bold text-[#003543] flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#00758a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        Refer & Earn
                    </h2>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Info Box */}
                    <div className="bg-gradient-to-r from-[#f0f9ff] to-[#e0f2fe] rounded-xl p-5 mb-6 border border-[#e6f0f3]">
                        <p className="text-[#003543] font-medium">
                            1. Share your referral code to earn ₹50 in your wallet when friends sign up!
                        </p>
                    </div>

                    {/* Referral Code Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-[#003543] mb-3">Your Referral Code</h3>
                        <div className="bg-white p-4 rounded-lg border border-[#e6f0f3] shadow-sm">
                            <div className="flex justify-between items-center">
                                <span className="font-mono font-bold text-xl text-[#005662]">{user.referralCode}</span>
                                <button
                                    className="text-white bg-gradient-to-r from-[#003543] to-[#00758a] px-4 py-2 rounded-lg font-medium hover:opacity-90 transition duration-300 shadow-md"
                                    onClick={() => {
                                        navigator.clipboard.writeText('REF5B0B4976');
                                        toast.success('Referral code copied!');
                                    }}
                                >
                                    Copy Code
                                </button>
                            </div>
                            <p className="text-[#527a85] mt-3 text-sm">
                                Share this code with friends when they register on our site.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Transaction History Section */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-[#e6f0f3]">
                    <h2 className="text-xl font-bold text-[#003543] flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-[#00758a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Transaction History
                    </h2>
                </div>

                {transactions.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="mx-auto w-24 h-24 bg-[#f0f9ff] rounded-full flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#527a85]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-[#003543] mb-1">No transactions yet</h3>
                        <p className="text-[#527a85]">Your transactions will appear here</p>
                        <button
                            onClick={openModal}
                            className="mt-4 bg-[#003543] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#004d5f] transition duration-300 inline-flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Money
                        </button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-[#e6f0f3]">
                            <thead className="bg-[#f0f9ff]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#527a85] uppercase tracking-wider">Transaction ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#527a85] uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#527a85] uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#527a85] uppercase tracking-wider">description</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-[#527a85] uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-[#e6f0f3]">
                                {transactions.map((transaction) => (
                                    <tr key={transaction.paymentId} className="hover:bg-[#f7fcff] transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#003543]">
                                            <span className="truncate max-w-xs inline-block">{transaction.paymentId}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#003543] font-medium">
                                            ₹{transaction.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#527a85]">
                                            {transaction.createdAt.split('T')[0]}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#527a85]">
                                            {transaction.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span
                                                className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === 'success'
                                                    ? 'bg-[#e6f7ee] text-[#006644]'
                                                    : 'bg-[#ffebee] text-[#d32f2f]'
                                                    }`}
                                            >
                                                {transaction.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add Funds Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-95 animate-fadeIn">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-[#003543]">Add Funds</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-[#527a85] hover:text-[#003543] transition duration-150"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="amount" className="block text-sm font-medium text-[#003543] mb-2">
                                    Enter Amount (₹)
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-[#527a85] sm:text-sm">₹</span>
                                    </div>
                                    <input
                                        type="number"
                                        id="amount"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        className="focus:ring-[#00758a] focus:border-[#00758a] block w-full pl-8 pr-12 py-3 sm:text-sm border-[#e6f0f3] rounded-lg border"
                                        placeholder="0.00"
                                        min="1"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <span className="text-[#527a85] sm:text-sm">INR</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-3 bg-[#e6f0f3] text-[#003543] rounded-lg font-medium hover:bg-[#d0e5ed] transition duration-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handlePayment}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-[#003543] to-[#00758a] text-white rounded-lg font-medium hover:opacity-90 transition duration-300 shadow-md"
                                >
                                    {loading ? 'loading' : 'Proceed to Pay'}
                                </button>
                            </div>
                        </div>

                        <div className="bg-[#f0f9ff] px-6 py-4 rounded-b-2xl">
                            <div className="flex items-center text-sm text-[#527a85]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#00758a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Payments are secured with Razorpay
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;
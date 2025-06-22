import React, { useState } from 'react';
import AuthInput from '../../components/common/AuthInput';

const Settings = () => {
    const [storeName, setStoreName] = useState('');
    const [password, setPassword] = useState('');
    const [storeEmail, setStoreEmail] = useState('');
    const [storeMobile, setStoreMobile] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [language, setLanguage] = useState('English');
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveChanges = () => {
        setIsSaving(true);
        console.log({
            storeName,
            password,
            storeEmail,
            storeMobile,
            currency,
            language,
            paymentMethod,
            maintenanceMode,
        });

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
        }, 1500);
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Store Settings</h2>
                <div className="flex items-center space-x-2">
                    <span className={`h-3 w-3 rounded-full ${maintenanceMode ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    <span className="text-sm text-gray-600">
                        {maintenanceMode ? 'Maintenance Mode' : 'Live Mode'}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 md:p-8 space-y-6">
                    {/* Basic Information Section */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <AuthInput
                                label="Store Name"
                                type="text"
                                name="storeName"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                placeholder="My Awesome Store"
                                width="w-full"
                                Textcolor="text-gray-700"
                                bgcolor="bg-gray-50"
                                borderColor="border-gray-200 hover:border-blue-400 focus:border-blue-500"
                            />
                            <AuthInput
                                label="Password"
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                width="w-full"
                                Textcolor="text-gray-700"
                                bgcolor="bg-gray-50"
                                borderColor="border-gray-200 hover:border-blue-400 focus:border-blue-500"
                            />
                            <AuthInput
                                label="Store Email"
                                type="email"
                                name="storeEmail"
                                value={storeEmail}
                                onChange={(e) => setStoreEmail(e.target.value)}
                                placeholder="store@example.com"
                                width="w-full"
                                Textcolor="text-gray-700"
                                bgcolor="bg-gray-50"
                                borderColor="border-gray-200 hover:border-blue-400 focus:border-blue-500"
                            />
                            <AuthInput
                                label="Store Mobile"
                                type="tel"
                                name="storeMobile"
                                value={storeMobile}
                                onChange={(e) => setStoreMobile(e.target.value)}
                                placeholder="+1 (555) 123-4567"
                                width="w-full"
                                Textcolor="text-gray-700"
                                bgcolor="bg-gray-50"
                                borderColor="border-gray-200 hover:border-blue-400 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Preferences</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                <select
                                    value={currency}
                                    onChange={(e) => setCurrency(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-700 transition-all"
                                >
                                    <option value="USD">US Dollar (USD)</option>
                                    <option value="EUR">Euro (EUR)</option>
                                    <option value="GBP">British Pound (GBP)</option>
                                    <option value="INR">Indian Rupee (INR)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 text-gray-700 transition-all"
                                >
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="German">German</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods Section */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Payment Methods</h3>
                        <div className="space-y-3">
                            <p className="text-sm text-gray-600">Select which payment methods to enable for your store (multiple allowed)</p>
                            <div className="flex flex-wrap gap-4">
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={paymentMethod.includes('COD')}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setPaymentMethod([...paymentMethod, 'COD']);
                                            } else {
                                                setPaymentMethod(paymentMethod.filter(method => method !== 'COD'));
                                            }
                                        }}
                                        className="form-checkbox h-5 w-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 rounded"
                                    />
                                    <span className="ml-3 text-gray-700">Cash on Delivery</span>
                                </label>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="paymentMethod"
                                        value="UPI"
                                        checked={paymentMethod.includes('UPI')}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setPaymentMethod([...paymentMethod, 'UPI']);
                                            } else {
                                                setPaymentMethod(paymentMethod.filter(method => method !== 'UPI'));
                                            }
                                        }}
                                        className="form-checkbox h-5 w-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 rounded"
                                    />
                                    <span className="ml-3 text-gray-700">UPI Payments</span>
                                </label>
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="paymentMethod"
                                        value="NETBANKING"
                                        checked={paymentMethod.includes('NETBANKING')}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setPaymentMethod([...paymentMethod, 'NETBANKING']);
                                            } else {
                                                setPaymentMethod(paymentMethod.filter(method => method !== 'NETBANKING'));
                                            }
                                        }}
                                        className="form-checkbox h-5 w-5 text-blue-600 border-2 border-gray-300 focus:ring-blue-500 rounded"
                                    />
                                    <span className="ml-3 text-gray-700">Net Banking</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Mode Section */}
                    <div className="space-y-5">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Store Status</h3>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-medium text-gray-800">Maintenance Mode</h4>
                                <p className="text-sm text-gray-600">
                                    {maintenanceMode
                                        ? 'Your store is currently in maintenance mode and not visible to customers'
                                        : 'Your store is currently live and visible to customers'}
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={maintenanceMode}
                                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-4">
                        <button
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                            className={`w-full md:w-auto px-6 py-3 rounded-lg font-medium text-white transition-all ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}`}
                        >
                            {isSaving ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
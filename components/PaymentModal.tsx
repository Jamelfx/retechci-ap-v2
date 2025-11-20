
import React, { useState, useEffect } from 'react';

interface PaymentModalProps {
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    amount?: number;
    donationOptions?: number[];
    allowCustomAmount?: boolean;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
    onClose, 
    onConfirm, 
    title, 
    description, 
    amount = 0,
    donationOptions = [],
    allowCustomAmount = false
}) => {
    const [paymentMethod, setPaymentMethod] = useState<'mobile' | 'card'>('mobile');
    const [processing, setProcessing] = useState(false);
    const [currentAmount, setCurrentAmount] = useState(amount);
    const [customAmount, setCustomAmount] = useState('');

    useEffect(() => {
        // If donation options are provided, set the initial amount to the first option, or 0 if none.
        if (donationOptions.length > 0) {
            setCurrentAmount(donationOptions[0]);
        }
    }, [donationOptions]);

    const handleConfirm = () => {
        setProcessing(true);
        // Simulate API call
        setTimeout(() => {
            onConfirm();
            setProcessing(false);
        }, 2000);
    }
    
    const handleAmountButtonClick = (value: number) => {
        setCurrentAmount(value);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setCustomAmount(value);
        setCurrentAmount(Number(value));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-brand-gray rounded-lg shadow-xl w-11/12 md:w-1/2 lg:w-1/3 max-w-lg" onClick={e => e.stopPropagation()}>
                <div className="p-6">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
                        <h2 className="text-2xl font-bold text-brand-red">{title}</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                    </div>
                    
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm">{description}</p>
                        
                        {donationOptions.length > 0 ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Choisir un montant</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {donationOptions.map(option => (
                                        <button 
                                            key={option}
                                            onClick={() => handleAmountButtonClick(option)}
                                            className={`p-2 rounded-md border-2 transition-colors text-sm font-semibold ${currentAmount === option && customAmount === '' ? 'bg-brand-red border-brand-red text-white' : 'border-gray-600 hover:bg-gray-800 text-gray-300'}`}
                                        >
                                            {option.toLocaleString('fr-FR')} FCFA
                                        </button>
                                    ))}
                                </div>
                                {allowCustomAmount && (
                                     <div className="mt-2">
                                         <input 
                                             type="text" 
                                             placeholder="Ou montant personnalisé" 
                                             value={customAmount}
                                             onChange={handleCustomAmountChange}
                                             className={`w-full bg-brand-dark border-2 rounded-md shadow-sm p-2 text-center text-sm focus:ring-brand-red focus:border-brand-red ${customAmount !== '' ? 'border-brand-red' : 'border-gray-600'}`} 
                                         />
                                     </div>
                                )}
                            </div>
                        ) : (
                             <p className="text-gray-300">Montant : <span className="font-bold text-white">{amount.toLocaleString('fr-FR')} FCFA</span></p>
                        )}
                        
                        <div className="flex space-x-4">
                            <button 
                                onClick={() => setPaymentMethod('mobile')}
                                className={`flex-1 p-3 rounded-md border-2 transition-colors ${paymentMethod === 'mobile' ? 'bg-brand-red border-brand-red' : 'border-gray-600 hover:bg-gray-800'}`}
                            >
                                Mobile Money
                            </button>
                             <button 
                                onClick={() => setPaymentMethod('card')}
                                className={`flex-1 p-3 rounded-md border-2 transition-colors ${paymentMethod === 'card' ? 'bg-brand-red border-brand-red' : 'border-gray-600 hover:bg-gray-800'}`}
                            >
                                Carte Bancaire
                            </button>
                        </div>

                        {paymentMethod === 'mobile' && (
                            <div>
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Numéro de téléphone</label>
                                <input type="tel" id="phone" placeholder="+225 01 02 03 04 05" className="w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                            </div>
                        )}

                        {paymentMethod === 'card' && (
                           <div className="space-y-3">
                                <div>
                                    <label htmlFor="card_number" className="block text-sm font-medium text-gray-300 mb-1">Numéro de carte</label>
                                    <input type="text" id="card_number" placeholder="**** **** **** ****" className="w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                                </div>
                                <div className="flex space-x-4">
                                    <div className="flex-1">
                                         <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-300 mb-1">Date d'expiration</label>
                                         <input type="text" id="expiry_date" placeholder="MM/AA" className="w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-300 mb-1">CVC</label>
                                         <input type="text" id="cvc" placeholder="***" className="w-full bg-brand-dark border-gray-600 rounded-md shadow-sm p-3 focus:ring-brand-red focus:border-brand-red" />
                                    </div>
                                </div>
                           </div>
                        )}
                        
                         <button 
                            onClick={handleConfirm}
                            disabled={processing || currentAmount <= 0}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Traitement...' : `Confirmer le Paiement (${currentAmount.toLocaleString('fr-FR')} FCFA)`}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;

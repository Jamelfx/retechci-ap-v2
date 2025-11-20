
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PaymentModal from './PaymentModal';

const DonationButton: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleConfirmDonation = () => {
        setIsModalOpen(false);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 5000);
    };

    return (
        <>
            {showSuccessMessage && (
                <div className="fixed top-20 right-6 z-50 bg-green-600 text-white p-4 rounded-lg shadow-lg text-center font-bold">
                    Merci infiniment pour votre soutien !
                </div>
            )}
            <div className="fixed bottom-24 right-6 z-50">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsModalOpen(true)}
                    className="bg-white text-brand-red w-16 h-16 rounded-full shadow-lg flex items-center justify-center"
                    aria-label="Faire un don"
                >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
                    </svg>
                </motion.button>
            </div>
            <AnimatePresence>
                {isModalOpen && (
                    <PaymentModal
                        onClose={() => setIsModalOpen(false)}
                        onConfirm={handleConfirmDonation}
                        title="Faire un Don"
                        description="Votre soutien est essentiel pour nous aider à promouvoir les talents du cinéma ivoirien. Chaque contribution fait une différence."
                        donationOptions={[5000, 15000, 25000]}
                        allowCustomAmount={true}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default DonationButton;

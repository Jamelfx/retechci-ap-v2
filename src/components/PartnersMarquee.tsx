import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Partner } from '../types/types';

interface PartnersMarqueeProps {
    partners: Partner[];
}

const PartnersMarquee: React.FC<PartnersMarqueeProps> = ({ partners }) => {
    if (!partners || partners.length === 0) {
        return null;
    }
    
    // Duplicate the partners array to create a seamless loop
    const extendedPartners = [...partners, ...partners];

    const itemWidth = 288; // w-56 (224px) + mx-8 (64px)
    
    // FIX: Explicitly type marqueeVariants with `Variants` to solve the type error where `repeatType: "loop"` was inferred as `string` instead of `RepeatType`.
    const marqueeVariants: Variants = {
        animate: {
            x: [0, -1 * (partners.length * itemWidth)],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 50, // Slightly increased duration for smoother feel with larger items
                    ease: "linear",
                },
            },
        },
    };

    return (
        <div className="w-full overflow-hidden py-8">
            <motion.div
                className="flex"
                variants={marqueeVariants}
                animate="animate"
            >
                {extendedPartners.map((partner, index) => (
                    <div
                        key={`${partner.name}-${index}`}
                        className="flex-shrink-0 w-56 h-28 flex items-center justify-center p-4 mx-8"
                        title={partner.name}
                    >
                        <img
                            src={partner.logoUrl}
                            alt={partner.name}
                            className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default PartnersMarquee;
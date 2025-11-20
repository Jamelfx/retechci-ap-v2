import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselItem {
    imageUrl: string;
    name: string;
    role?: string;
}

interface CarouselProps {
    items: CarouselItem[];
}

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0
    })
};

const Carousel: React.FC<CarouselProps> = ({ items }) => {
    const [[page, direction], setPage] = useState([0, 0]);

    // This ensures the index wraps around correctly for both positive and negative directions
    const imageIndex = page % items.length >= 0 ? page % items.length : (page % items.length) + items.length;

    const paginate = (newDirection: number) => {
        setPage([page + newDirection, newDirection]);
    };

    return (
        <div className="relative w-full flex items-center justify-center" style={{ minHeight: '450px' }}>
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={page}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className="absolute w-full h-full flex flex-col items-center justify-center"
                >
                    <div className="w-full max-w-[320px] aspect-square">
                         <img
                            src={items[imageIndex].imageUrl}
                            alt={items[imageIndex].name}
                            className="w-full h-full rounded-lg object-cover border-4 border-gray-700 shadow-xl"
                        />
                    </div>
                   
                    <div className="text-center mt-4">
                        <h4 className="text-xl font-bold text-white">{items[imageIndex].name}</h4>
                        {items[imageIndex].role && (
                            <p className="text-brand-red text-md">{items[imageIndex].role}</p>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
            <button
                aria-label="Membre précédent"
                className="absolute top-1/2 left-0 -translate-y-1/2 z-10 bg-brand-gray bg-opacity-50 rounded-full p-2 cursor-pointer hover:bg-opacity-80 transition-colors"
                onClick={() => paginate(-1)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <button
                aria-label="Membre suivant"
                className="absolute top-1/2 right-0 -translate-y-1/2 z-10 bg-brand-gray bg-opacity-50 rounded-full p-2 cursor-pointer hover:bg-opacity-80 transition-colors"
                onClick={() => paginate(1)}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    );
};

export default Carousel;
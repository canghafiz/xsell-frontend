'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
    return (
        <div className="w-full relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url(/bg_discover.webp)' }}
            >
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            <div className="relative z-10 max-w-3xl mx-auto text-center">
                {/* Judul — looping fade */}
                <motion.h1
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
                    animate={{
                        opacity: [0, 1, 1, 0],
                        y: [20, 0, 0, 20],
                    }}
                    transition={{
                        duration: 4, // total durasi 1 siklus
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                    }}
                >
                    Discover Amazing Deals
                </motion.h1>

                {/* Subtitle — delay 0.5 detik dari judul */}
                <motion.p
                    className="mt-4 text-lg text-white/90"
                    animate={{
                        opacity: [0, 1, 1, 0],
                        y: [20, 0, 0, 20],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "loop",
                        ease: "easeInOut",
                        delay: 0.5, // delay relatif terhadap siklus animasi
                    }}
                >
                    High-quality second-hand items, handpicked for you.
                </motion.p>
            </div>
        </div>
    );
}
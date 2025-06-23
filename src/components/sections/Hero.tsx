import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-kebab-brown to-kebab-red">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-pattern"></div>
      
      {/* Content Container */}
      <div className="container-custom relative z-10 py-20 md:py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-kebab-white"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Rasakan <span className="text-kebab-yellow accent-font">Kelezatan</span> Kebab Autentik
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <p className="text-lg md:text-xl mb-8 text-kebab-white/90">
                Dibuat dengan bahan-bahan berkualitas tinggi dan resep tradisional yang telah diwariskan selama generasi.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/products" className="btn-primary">
                Lihat Menu
              </Link>
              <Link to="/order" className="bg-transparent border-2 border-kebab-white text-kebab-white font-medium py-2 px-6 rounded-full hover:bg-kebab-white hover:text-kebab-red transition duration-300">
                Pesan Sekarang
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="relative"
          >
            <motion.div
              animate={{ 
                y: [0, -15, 0],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 3,
                ease: "easeInOut" 
              }}
              className="relative z-10"
            >
              <div className="relative w-full h-[400px] md:h-[500px]">
                <div className="absolute inset-0 bg-kebab-yellow/20 rounded-full blur-3xl transform -translate-x-10"></div>
                <div className="w-full h-full flex items-center justify-center">
                  {/* Placeholder for kebab image - in production, use an actual image */}
                  <div className="w-64 h-64 md:w-80 md:h-80 bg-kebab-yellow rounded-full flex items-center justify-center text-kebab-brown text-xl font-bold">
                    <img src="/gambar1.png" alt="kebab" className="w-full h-full object-cover rounded-full" />
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ 
                rotate: [0, 10, 0, -10, 0],
                y: [0, -10, 0, -5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 5,
                ease: "easeInOut" 
              }}
              className="absolute top-10 px-4 right-10 w-16 h-16 bg-kebab-green rounded-full flex items-center justify-center text-white text-xs font-bold"
            >
              100% Halal
            </motion.div>
            
            <motion.div
              animate={{ 
                rotate: [0, -10, 0, 10, 0],
                y: [0, 10, 0, 5, 0]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 4,
                ease: "easeInOut" 
              }}
              className="absolute bottom-10 left-10 w-20 h-20 bg-kebab-red rounded-full flex items-center justify-center text-white text-xs font-bold"
            >
              Fresh Daily
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        animate={{ 
          y: [0, 10, 0],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut" 
        }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-kebab-white flex flex-col items-center"
      >
        <p className="text-sm mb-2">Scroll Down</p>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
    </div>
  );
};

export default Hero;

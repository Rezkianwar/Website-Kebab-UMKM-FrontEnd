import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Products: React.FC = () => {
  // Sample product data - Simpan sebagai konstanta di luar state
  const allProducts = [
    {
      id: 1,
      name: 'Kebab Daging Sapi',
      description: 'Daging sapi pilihan dengan bumbu rempah khas Timur Tengah',
      price: 25000,
      category: 'Kebab Daging',
      image: 'kebabdaging.png'
    },
    {
      id: 2,
      name: 'Kebab Ayam Spesial',
      description: 'Daging ayam juicy dengan saus spesial dan sayuran segar',
      price: 20000,
      category: 'Kebab Ayam',
      image: 'kebabayam.png'
    },
    {
      id: 3,
      name: 'Kebab Vegetarian',
      description: 'Kombinasi sayuran segar dengan saus tahini dan hummus',
      price: 18000,
      category: 'Kebab Vegetarian',
      image: 'kebabvegetarian.png'
    },
    {
      id: 4,
      name: 'Kebab Jumbo Mix',
      description: 'Kombinasi daging sapi dan ayam dengan porsi jumbo',
      price: 35000,
      category: 'Kebab Daging',
      image: 'kebabmix.png'
    },
    {
      id: 5,
      name: 'Kebab Daging Sosis',
      description: 'Kombinasi daging sapi dan sosis dengan porsi jumbo',
      price: 30000,
      category: 'Kebab Daging',
      image: 'kebabdagingsosis.png'
    }
  ];

  const categories = ['Semua', 'Kebab Daging', 'Kebab Ayam', 'Kebab Vegetarian'];
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [filteredProducts, setFilteredProducts] = useState(allProducts);

  // Gunakan useEffect untuk memfilter produk setiap kali activeCategory berubah
  useEffect(() => {
    if (activeCategory === 'Semua') {
      setFilteredProducts(allProducts);
    } else {
      const filtered = allProducts.filter(product => product.category === activeCategory);
      setFilteredProducts(filtered);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="products" className="section bg-kebab-white/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-kebab-brown mb-4">
            Menu <span className="text-kebab-red">Kebab</span> Kami
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-kebab-yellow mx-auto mb-6"
          ></motion.div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Nikmati berbagai pilihan kebab kami yang dibuat dengan bahan-bahan segar dan berkualitas tinggi. 
            Dari kebab daging sapi hingga pilihan vegetarian, semua tersedia untuk memenuhi selera Anda.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-kebab-red text-white shadow-md'
                  : 'bg-white text-kebab-brown border border-kebab-brown/20 hover:border-kebab-red'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          variants={containerVariants}
         
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 bg-kebab-yellow/20 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-kebab-brown font-medium">
                    <img src={`${product.image}`} alt="" />
                  </div>
                  <div className="absolute top-4 right-4 bg-kebab-red text-white text-sm font-bold px-3 py-1 rounded-full">
                    Rp {product.price.toLocaleString()}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg text-kebab-brown mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-kebab-green/10 text-kebab-green px-3 py-1 rounded-full">
                      {product.category}
                    </span>
                    <Link to="/order">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-kebab-red hover:text-kebab-brown transition-colors duration-300"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500">Tidak ada produk dalam kategori ini.</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Link to="/products" className="btn-primary">
            Lihat Menu Lengkap
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Products;

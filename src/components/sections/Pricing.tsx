import React from 'react';
import { motion } from 'framer-motion';

const Pricing: React.FC = () => {
  const pricingPlans = [
    {
      id: 1,
      name: 'Paket Individual',
      price: 25000,
      description: 'Paket hemat untuk satu orang',
      features: [
        '1 Kebab pilihan',
        '1 Minuman',
        'Saus tambahan',
        'Kentang goreng kecil'
      ],
      popular: false,
      color: 'kebab-green'
    },
    {
      id: 2,
      name: 'Paket Keluarga',
      price: 95000,
      description: 'Paket lengkap untuk keluarga',
      features: [
        '4 Kebab pilihan',
        '4 Minuman',
        'Saus tambahan',
        'Kentang goreng jumbo',
        'Gratis 1 dessert'
      ],
      popular: true,
      color: 'kebab-red'
    },
    {
      id: 3,
      name: 'Paket Pesta',
      price: 250000,
      description: 'Paket untuk acara dan pesta',
      features: [
        '10 Kebab pilihan',
        '10 Minuman',
        'Saus tambahan',
        '2 Kentang goreng jumbo',
        '5 Dessert',
        'Gratis pengiriman'
      ],
      popular: false,
      color: 'kebab-yellow'
    }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="pricing" className="section bg-kebab-brown/5">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-kebab-brown mb-4">
            Paket <span className="text-kebab-red">Harga</span>
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-kebab-yellow mx-auto mb-6"
          ></motion.div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Kami menawarkan berbagai paket harga yang sesuai dengan kebutuhan Anda, 
            mulai dari paket individual hingga paket pesta untuk acara besar.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: index * 0.2 }}
              className={`card relative overflow-hidden ${
                plan.popular ? 'ring-2 ring-kebab-red transform md:-translate-y-4' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-kebab-red text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  TERPOPULER
                </div>
              )}
              
              <div className={`p-8 text-center`}>
                <div className={`w-16 h-16 rounded-full bg-${plan.color}/20 text-${plan.color} flex items-center justify-center mx-auto mb-4`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <h3 className="text-xl font-bold text-kebab-brown mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-3xl font-bold text-kebab-brown">Rp {plan.price.toLocaleString()}</span>
                </div>
                
                <ul className="space-y-3 mb-8 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <svg className={`w-5 h-5 mr-2 text-${plan.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-3 px-6 rounded-full font-medium transition duration-300 ${
                    plan.popular 
                      ? 'bg-kebab-red text-white shadow-lg hover:shadow-xl' 
                      : 'bg-white border border-gray-300 text-kebab-brown hover:border-kebab-red hover:text-kebab-red'
                  }`}
                >
                  Pilih Paket
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 bg-white p-8 rounded-xl shadow-md"
        >
          <h3 className="text-xl font-bold text-kebab-brown mb-4 text-center">Butuh Paket Khusus?</h3>
          <p className="text-gray-700 text-center mb-6">
            Kami juga menyediakan paket catering untuk acara pernikahan, ulang tahun, atau acara perusahaan.
            Hubungi kami untuk mendapatkan penawaran khusus.
          </p>
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
            >
              Hubungi Kami
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;

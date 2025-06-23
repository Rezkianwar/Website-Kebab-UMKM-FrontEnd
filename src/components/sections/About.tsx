import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="about" className="section bg-kebab-white">
      <div className="container-custom">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="text-center mb-12"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-3xl md:text-4xl font-bold text-kebab-brown mb-4"
          >
            Tentang <span className="text-kebab-red">Kami</span>
          </motion.h2>
          <motion.div 
            variants={{
              hidden: { width: 0 },
              visible: { 
                width: "80px",
                transition: { duration: 0.8, delay: 0.2 }
              }
            }}
            className="h-1 bg-kebab-yellow mx-auto"
          ></motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="relative"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { 
                  opacity: 1, 
                  scale: 1,
                  transition: { duration: 0.6 }
                }
              }}
              className="relative rounded-lg overflow-hidden shadow-xl"
            >
              <div className="bg-kebab-yellow h-80 flex items-center justify-center">
                <img src="toko.png" alt="toko" className="w-full h-full object-cover" />
              </div>
            </motion.div>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -30 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { duration: 0.6, delay: 0.3 }
                }
              }}
              className="absolute -bottom-12 -left-6 w-32 h-32 bg-kebab-red rounded-lg shadow-lg flex items-center justify-center text-white p-4 text-center"
            >
              <div>
                <p className="text-2xl font-bold">5+</p>
                <p className="text-sm">Tahun Pengalaman</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-6"
          >
            <motion.h3 
              variants={fadeIn}
              className="text-2xl font-bold text-kebab-brown"
            >
              Cerita Kebab UMKM
            </motion.h3>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6, delay: 0.2 }
                }
              }}
              className="text-gray-700"
            >
              Kebab UMKM didirikan pada tahun 2020 dengan visi sederhana: menyajikan kebab autentik dengan bahan-bahan lokal berkualitas tinggi. Dimulai dari sebuah gerobak kecil di pasar malam, kini kami telah berkembang menjadi restoran kebab yang dikenal di seluruh kota.
            </motion.p>
            
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6, delay: 0.3 }
                }
              }}
              className="text-gray-700"
            >
              Kami menggabungkan resep tradisional dengan sentuhan lokal untuk menciptakan kebab yang tidak hanya lezat tetapi juga mencerminkan kekayaan kuliner Indonesia. Setiap kebab dibuat dengan cinta dan perhatian terhadap detail.
            </motion.p>

            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.6, delay: 0.4 }
                }
              }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4"
            >
              <div className="text-center">
                <div className="w-12 h-12 bg-kebab-red/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-12 h-13 text-kebab-red" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-medium text-kebab-brown px-5">100% Halal</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-kebab-green/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-kebab-green" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </div>
                <p className="font-medium text-kebab-brown">Bahan Segar</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-kebab-yellow/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6 text-kebab-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-medium text-kebab-brown">Cepat Saji</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast'; // Import toast dari react-hot-toast

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'Pertanyaan Umum'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ===== START MODIFIKASI DENGAN REACT HOT TOAST =====
    
    // Pertama, tampilkan notifikasi loading.
    // Ini bagus untuk memberikan umpan balik instan bahwa aksi sedang diproses.
    const loadingToastId = toast.loading('Mengirim pesan Anda...');

 
    setTimeout(() => {
      console.log('Form submitted:', formData);

      // Anggap pengiriman berhasil
      const isSuccess = true; // Ganti ini dengan hasil sebenarnya dari API call Anda

      if (isSuccess) {
        // Hapus notifikasi loading dan tampilkan notifikasi sukses
        toast.success('Terima kasih! Pesan Anda telah terkirim.', {
          id: loadingToastId, // Penting: gunakan ID yang sama untuk memperbarui notifikasi loading
          duration: 4000, // Notifikasi akan bertahan 4 detik
          position: 'top-center' // Atur posisi spesifik untuk notifikasi ini jika diinginkan
        });
        
        // Reset form data setelah berhasil
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          subject: 'Pertanyaan Umum'
        });
      } else {
        // Jika terjadi kesalahan saat pengiriman
        toast.error('Gagal mengirim pesan. Silakan coba lagi nanti.', {
          id: loadingToastId, // Perbarui notifikasi loading menjadi error
          duration: 5000,
          position: 'top-center'
        });
      }
    }, 2000); // Simulasi delay 2 detik

    // ===== END MODIFIKASI DENGAN REACT HOT TOAST =====
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="contact" className="section bg-kebab-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-kebab-brown mb-4">
            Hubungi <span className="text-kebab-red">Kami</span>
          </h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "80px" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-kebab-yellow mx-auto mb-6"
          ></motion.div>
          <p className="text-gray-700 max-w-2xl mx-auto">
            Ada pertanyaan atau ingin memesan? Jangan ragu untuk menghubungi kami. 
            Tim kami siap membantu Anda dengan segala kebutuhan kebab Anda.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <div className="bg-white rounded-xl shadow-md p-8">
              <h3 className="text-xl font-bold text-kebab-brown mb-6">Kirim Pesan</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kebab-red focus:border-transparent outline-none transition"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kebab-red focus:border-transparent outline-none transition"
                      placeholder="email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Telepon
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kebab-red focus:border-transparent outline-none transition"
                      placeholder="08xxxxxxxxxx"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subjek
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kebab-red focus:border-transparent outline-none transition"
                  >
                    <option value="Pertanyaan Umum">Pertanyaan Umum</option>
                    <option value="Pemesanan">Pemesanan</option>
                    <option value="Katering">Katering</option>
                    <option value="Kerjasama">Kerjasama</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-kebab-red focus:border-transparent outline-none transition"
                    placeholder="Tulis pesan Anda di sini..."
                  ></textarea>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full btn-primary"
                >
                  Kirim Pesan
                </motion.button>
              </form>
            </div>
          </motion.div>
          
          {/* Contact Information */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-kebab-brown rounded-xl shadow-md p-8 text-white h-full">
              <h3 className="text-xl font-bold mb-6">Informasi Kontak</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-kebab-red/20 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-kebab-yellow mb-1">Alamat</h4>
                    <p className="text-white/80">
                      Jl. Kebab Lezat No. 123<br />
                      Kota Makanan, Indonesia 12345
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-kebab-red/20 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-kebab-yellow mb-1">Telepon</h4>
                    <p className="text-white/80">
                      +62 812 3456 7890<br />
                      +62 898 7654 3210
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-kebab-red/20 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-kebab-yellow mb-1">Email</h4>
                    <p className="text-white/80">
                      info@kebabumkm.com<br />
                      order@kebabumkm.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 bg-kebab-red/20 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-kebab-yellow mb-1">Jam Operasional</h4>
                    <p className="text-white/80">
                      Senin - Jumat: 10:00 - 22:00<br />
                      Sabtu - Minggu: 11:00 - 23:00
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-medium text-kebab-yellow mb-4">Ikuti Kami</h4>
                <div className="flex space-x-4">
                  {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                    <motion.a
                      key={social}
                      href={`#${social}`}
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-kebab-red/20 rounded-full flex items-center justify-center text-white hover:bg-kebab-red transition-colors duration-300"
                    >
                      <span className="sr-only">{social}</span>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                      </svg>
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
             {/* ===== START MODIFIKASI UNTUK MAP ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-white rounded-xl shadow-md overflow-hidden h-80" // Gunakan h-80 agar peta punya tinggi yang cukup
        >
          {/* Ganti div ini dengan iframe Google Maps Anda */}
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d454.4679382743167!2d106.81424032291227!3d-6.418915596231073!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69e97ef22fab3d%3A0x34f960f04de892fd!2sJl.%20Gandaria%201%20Depok!5e0!3m2!1sid!2sid!4v1751116456861!5m2!1sid!2sid" 
            width="100%" // Gunakan 100% agar responsif terhadap parent-nya
            height="100%" // Gunakan 100% agar mengisi tinggi div parent-nya
            style={{ border: 0 }} // Gunakan object style untuk CSS di React
            allowFullScreen={true} // Gunakan camelCase untuk prop React
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade" // Gunakan camelCase untuk prop React
            title="Lokasi Toko Kebab" // Tambahkan title untuk aksesibilitas
          ></iframe>
        </motion.div>
        {/* ===== END MODIFIKASI UNTUK MAP ===== */}
      </div>
    </section>
  );
};

export default Contact;
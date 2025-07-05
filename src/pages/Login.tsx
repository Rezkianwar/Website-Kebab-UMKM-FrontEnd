import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; // <--- Import toast dari react-hot-toast

const Login: React.FC = () => {
  const { login } = useAuth(); // Ambil fungsi login dari AuthContext

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  // const [error, setError] = useState(''); // <--- Hapus state error ini
  const [loading, setLoading] = useState(false);

  const { email, password } = formData;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // setError(''); // <--- Hapus ini juga

    let loadingToastId: string | undefined; // Variabel untuk menyimpan ID toast loading

    try {
      loadingToastId = toast.loading('Login...'); // Tampilkan toast loading
      await login(email, password); // <-- Panggil fungsi login()

      // Jika login berhasil
      toast.success('Login berhasil! Selamat datang.', {
        id: loadingToastId, // Gunakan ID toast loading agar toast sebelumnya diganti
        duration: 3000,
        position: 'top-center'
      });
      // Tidak perlu reset form karena biasanya setelah login berhasil akan redirect
      // setFormData({ email: '', password: '' }); 

    } catch (err: any) {
      const errorMessage = err.message || 'Login gagal. Silakan coba lagi.';
      toast.error(errorMessage, {
        id: loadingToastId, // Gunakan ID toast loading agar toast sebelumnya diganti
        duration: 5000,
        position: 'top-center'
      });
      //setError(errorMessage); // <--- Hapus ini
    } finally {
      setLoading(false);
      // toast.dismiss(loadingToastId); // Ini tidak perlu jika menggunakan id di toast.success/error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-kebab-brown to-kebab-red py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden p-6"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center">
            <span className="text-kebab-red text-3xl font-bold accent-font mr-2">Kebab</span>
            <span className="text-kebab-brown text-xl">UMKM</span>
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900">
            Login Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Masukkan email dan password untuk mengakses dashboard
          </p>
        </div>

        {/* Hapus blok error ini karena kita akan menggunakan toast */}
        {/* {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4"
          >
            {error}
          </motion.div>
        )} */}

        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={onChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={onChange}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-kebab-red focus:ring-kebab-red border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Ingat saya
              </label>
            </div>

            <div className="text-sm">
              <a href="#lupa_password" className="font-medium text-kebab-red hover:text-kebab-brown">
                Lupa password?
              </a>
            </div>
          </div>

          <div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-kebab-red hover:bg-kebab-brown focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kebab-red transition-colors ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Memproses...' : 'Login'}
            </motion.button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-kebab-red hover:text-kebab-brown">
            Kembali ke Halaman Utama
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
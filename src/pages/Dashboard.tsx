import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  totalEmployees: number;
  recentSales: any[];
  topProducts: Array<{
    _id: string;
    name: string;
    totalSold: number;
  }>;
  monthlySales: Array<{
    _id: number; // bulan (1-12)
    totalAmount: number;
  }>;
}

const Dashboard: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    totalEmployees: 0,
    recentSales: [],
    topProducts: [],
    monthlySales: []
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch stats
        const salesStatsRes = await apiClient.get('/sales/stats');
        const productsRes = await apiClient.get('/products/count');
        const customersRes = await apiClient.get('/customers/count');
        const employeesRes = await apiClient.get('/employees/count');
        const recentSalesRes = await apiClient.get('/sales/recent');
        const topProductsRes = await apiClient.get('/products/top');

        setStats({
          totalSales: salesStatsRes.data.data.month.totalSales || 0,
          totalRevenue: salesStatsRes.data.data.month.totalAmount || 0,
          totalProducts: productsRes.data.count || 0,
          totalCustomers: customersRes.data.count || 0,
          totalEmployees: employeesRes.data.count || 0,
          recentSales: recentSalesRes.data.data || [],
          topProducts: topProductsRes.data.data || [],
          monthlySales: salesStatsRes.data.data.monthlyBreakdown || []
        });
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err.response?.data || err.message);
        setError('Gagal memuat data dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated, loading, navigate]);

  // Helper untuk chart penjualan bulanan
  const getSalesChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = Array(12).fill(0);

    stats.monthlySales.forEach(item => {
      if (item._id >= 1 && item._id <= 12) {
        monthlyData[item._id - 1] = item.totalAmount;
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Penjualan Bulanan',
          data: monthlyData,
          fill: false,
          backgroundColor: 'rgba(220, 38, 38, 0.2)',
          borderColor: 'rgba(220, 38, 38, 1)',
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: 'rgba(220, 38, 38, 1)'
        }
      ]
    };
  };

  // Helper untuk chart produk terlaris
  const getTopProductsChartData = () => {
    return {
      labels: stats.topProducts.map(p => p.name),
      datasets: [
        {
          label: 'Produk Terlaris',
          data: stats.topProducts.map(p => p.totalSold),
          backgroundColor: [
            'rgba(220, 38, 38, 0.7)',   // Merah
            'rgba(245, 158, 11, 0.7)',  // Kuning
            'rgba(16, 185, 129, 0.7)',  // Hijau
            'rgba(59, 130, 246, 0.7)', // Biru
            'rgba(139, 92, 246, 0.7)'   // Ungu
          ],
          borderColor: [
            'rgba(220, 38, 38, 1)',
            'rgba(245, 158, 11, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(59, 130, 246, 1)',
            'rgba(139, 92, 246, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="text-sm text-gray-600">
          {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kebab-red"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Pendapatan Bulan Ini */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Pendapatan Bulan Ini</h2>
                  <p className="text-lg font-semibold text-gray-900">
                    Rp {stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Total Penjualan */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Total Penjualan</h2>
                  <p className="text-lg font-semibold text-gray-900">{stats.totalSales} transaksi</p>
                </div>
              </div>
            </motion.div>

            {/* Total Pelanggan */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Total Pelanggan</h2>
                  <p className="text-lg font-semibold text-gray-900">{stats.totalCustomers}</p>
                </div>
              </div>
            </motion.div>

            {/* Total Produk */}
            <motion.div whileHover={{ y: -5 }} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012 2h2a2 2 0 012 2v1M9 5a2 2 0 002-2h2a2 2 0 002-2" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h2 className="text-sm font-medium text-gray-500">Total Produk</h2>
                  <p className="text-lg font-semibold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Grafik Penjualan Bulanan */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Grafik Penjualan Bulanan</h3>
              <div className="h-64">
                <Line
                  data={getSalesChartData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'top'
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => `Rp ${Number(context.raw).toLocaleString()}`
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value) => `Rp ${Number(value).toLocaleString()}`
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Produk Terlaris */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Produk Terlaris</h3>
              <div className="h-64">
                <Doughnut
                  data={getTopProductsChartData()}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Recent Sales Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">Transaksi Terbaru</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Pesanan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelanggan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentSales.length > 0 ? (
                    stats.recentSales.map((sale: any) => (
                      <tr key={sale._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{sale.orderNumber}</div>
                          <div className="text-xs text-gray-500">{sale.orderType}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {sale.customer ? (
                            <span>{sale.customer.name}</span>
                          ) : (
                            <span className="text-sm text-gray-500">Umum</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Rp {sale.totalAmount.toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            sale.paymentStatus === 'Dibayar'
                              ? 'bg-green-100 text-green-800'
                              : sale.paymentStatus === 'Belum Dibayar'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                          }`}>
                            {sale.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(sale.createdAt).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                        Tidak ada transaksi terbaru
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-gray-50 text-right">
              <button
                onClick={() => navigate('/sales')}
                className="text-sm font-medium text-kebab-red hover:text-kebab-brown"
              >
                Lihat Semua Transaksi
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/dashboard/products')} className="bg-white rounded-lg shadow p-6 cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-kebab-red/10 text-kebab-red mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Kelola Produk</h3>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/dashboard/customers')} className="bg-white rounded-lg shadow p-6 cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-kebab-red/10 text-kebab-red mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Kelola Pelanggan</h3>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/employees')} className="bg-white rounded-lg shadow p-6 cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-kebab-red/10 text-kebab-red mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 110-14 7 7 0 010 14z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Kelola Pegawai</h3>
              </div>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/dashboard/sales')} className="bg-white rounded-lg shadow p-6 cursor-pointer">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-kebab-red/10 text-kebab-red mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 6H7m10 0h1m-1 0h-1m4 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-medium text-gray-900">Laporan Penjualan</h3>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
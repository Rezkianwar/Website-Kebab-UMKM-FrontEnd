import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Sale {
  _id: string;
  orderNumber: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  } | null;
  items: Array<{
    product: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'Belum Dibayar' | 'Dibayar' | 'Dibatalkan';
  orderStatus: 'Baru' | 'Diproses' | 'Siap' | 'Selesai' | 'Dibatalkan';
  orderType: 'Dine-in' | 'Take Away' | 'Delivery';
  notes?: string;
  employee?: {
    _id: string;
    name: string;
  };
  createdAt: string;
}

interface SalesStats {
  today: {
    totalSales: number;
    totalAmount: number;
  };
  month: {
    totalSales: number;
    totalAmount: number;
  };
  year: {
    totalSales: number;
    totalAmount: number;
  };
  monthlyBreakdown: Array<{
    _id: number;
    totalSales: number;
    totalAmount: number;
  }>;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
}

interface Employee {
  _id: string;
  name: string;
  position: string;
}

const SalesPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  const [sales, setSales] = useState<Sale[]>([]);
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  
  // Date range filter
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Default to last 30 days
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentSale, setCurrentSale] = useState<Partial<Sale>>({
    customer: null,
    items: [],
    totalAmount: 0,
    paymentMethod: 'Tunai',
    paymentStatus: 'Belum Dibayar',
    orderStatus: 'Baru',
    orderType: 'Dine-in',
    notes: ''
  });
  
  // New item state
  const [newItem, setNewItem] = useState({
    product: '',
    quantity: 1
  });
  
  // Fetch sales and related data
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch sales with date range
        const salesRes = await apiClient.get(`/sales/range?startDate=${startDate}&endDate=${endDate}`);
        setSales(salesRes.data.data);
        
        // Fetch sales stats
        const statsRes = await apiClient.get('/sales/stats');
        setSalesStats(statsRes.data.data);
        
        // Fetch customers for dropdown
        const customersRes = await apiClient.get('/customers');
        setCustomers(customersRes.data.data);
        
        // Fetch products for dropdown
        const productsRes = await apiClient.get('/products');
        setProducts(productsRes.data.data);
        
        // Fetch employees for dropdown
        const employeesRes = await apiClient.get('/employees');
        setEmployees(employeesRes.data.data);
        
        setError('');
      } catch (err: any) {
        setError('Gagal memuat data penjualan');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, loading, navigate, startDate, endDate]);
  
  // Handle date filter change
  const handleDateFilterChange = () => {
    // Re-fetch data with new date range
    // This will trigger the useEffect above
  };
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'customer') {
      const selectedCustomer = customers.find(c => c._id === value);
      setCurrentSale({
        ...currentSale,
        customer: selectedCustomer ? {
          _id: selectedCustomer._id,
          name: selectedCustomer.name,
          email: selectedCustomer.email,
          phone: selectedCustomer.phone
        } : null
      });
    } else if (name === 'employee') {
      const selectedEmployee = employees.find(e => e._id === value);
      setCurrentSale({
        ...currentSale,
        employee: selectedEmployee ? {
          _id: selectedEmployee._id,
          name: selectedEmployee.name
        } : undefined
      });
    } else {
      setCurrentSale({
        ...currentSale,
        [name]: value
      });
    }
  };
  
  // Handle new item change
  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'product') {
      setNewItem({
        ...newItem,
        product: value
      });
    } else if (name === 'quantity') {
      setNewItem({
        ...newItem,
        quantity: parseInt(value) || 1
      });
    }
  };
  
  // Add item to sale
  const handleAddItem = () => {
    if (!newItem.product) return;
    
    const selectedProduct = products.find(p => p._id === newItem.product);
    if (!selectedProduct) return;
    
    const updatedItems = [
      ...(currentSale.items || []),
      {
        product: selectedProduct._id,
        name: selectedProduct.name,
        price: selectedProduct.price,
        quantity: newItem.quantity
      }
    ];
    
    // Calculate new total
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setCurrentSale({
      ...currentSale,
      items: updatedItems,
      totalAmount: newTotal
    });
    
    // Reset new item form
    setNewItem({
      product: '',
      quantity: 1
    });
  };
  
  // Remove item from sale
  const handleRemoveItem = (index: number) => {
    const updatedItems = [...(currentSale.items || [])];
    updatedItems.splice(index, 1);
    
    // Calculate new total
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    setCurrentSale({
      ...currentSale,
      items: updatedItems,
      totalAmount: newTotal
    });
  };
  
  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentSale.items || currentSale.items.length === 0) {
      setError('Penjualan harus memiliki minimal 1 item');
      return;
    }
    
    try {
      if (isEditing) {
        await apiClient.put(`/sales/${currentSale._id}`, currentSale);
        
        // Update sales list
        setSales(sales.map(sale => 
          sale._id === currentSale._id ? { ...sale, ...currentSale } as Sale : sale
        ));
      } else {
        const res = await apiClient.post('/sales', currentSale);
        
        // Add new sale to list
        setSales([...sales, res.data.data]);
      }
      
      // Close modal and reset form
      setIsModalOpen(false);
      setCurrentSale({
        customer: null,
        items: [],
        totalAmount: 0,
        paymentMethod: 'Tunai',
        paymentStatus: 'Belum Dibayar',
        orderStatus: 'Baru',
        orderType: 'Dine-in',
        notes: ''
      });
      setIsEditing(false);
      
      // Refresh stats
      const statsRes = await apiClient.get('/sales/stats');
      setSalesStats(statsRes.data.data);
    } catch (err: any) {
      console.error('Error saving sale:', err);
      setError(err.response?.data?.error || 'Gagal menyimpan data penjualan');
    }
  };
  
  // Handle delete sale
  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data penjualan ini?')) {
      try {
        await apiClient.delete(`/sales/${id}`);
        
        // Remove sale from list
        setSales(sales.filter(sale => sale._id !== id));
        
        // Refresh stats
        const statsRes = await apiClient.get('/sales/stats');
        setSalesStats(statsRes.data.data);
      } catch (err: any) {
        console.error('Error deleting sale:', err);
        setError(err.response?.data?.error || 'Gagal menghapus data penjualan');
      }
    }
  };
  
  // Handle modal open for editing sale
  const handleEdit = (sale: Sale) => {
    setCurrentSale(sale);
    setIsEditing(true);
    setIsModalOpen(true);
  };
  
  // Handle modal open for adding new sale
  const handleAdd = () => {
    setCurrentSale({
      customer: null,
      items: [],
      totalAmount: 0,
      paymentMethod: 'Tunai',
      paymentStatus: 'Belum Dibayar',
      orderStatus: 'Baru',
      orderType: 'Dine-in',
      notes: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Dibayar':
      case 'Selesai':
        return 'bg-green-100 text-green-800';
      case 'Diproses':
      case 'Siap':
        return 'bg-blue-100 text-blue-800';
      case 'Belum Dibayar':
      case 'Baru':
        return 'bg-yellow-100 text-yellow-800';
      case 'Dibatalkan':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Prepare chart data
  const getChartData = () => {
    if (!salesStats) return null;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = Array(12).fill(0);
    
    salesStats.monthlyBreakdown.forEach(item => {
      monthlyData[item._id - 1] = item.totalAmount;
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
          tension: 0.4
        }
      ]
    };
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Penjualan</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="bg-kebab-red hover:bg-kebab-brown text-white px-4 py-2 rounded-lg transition-colors"
        >
          Tambah Penjualan
        </motion.button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      {/* Sales Statistics */}
      {!isLoading && salesStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Penjualan Hari Ini</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">Rp {salesStats.today.totalAmount.toLocaleString()}</p>
              <p className="ml-2 text-sm text-gray-600">({salesStats.today.totalSales} transaksi)</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Penjualan Bulan Ini</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">Rp {salesStats.month.totalAmount.toLocaleString()}</p>
              <p className="ml-2 text-sm text-gray-600">({salesStats.month.totalSales} transaksi)</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Penjualan Tahun Ini</h3>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">Rp {salesStats.year.totalAmount.toLocaleString()}</p>
              <p className="ml-2 text-sm text-gray-600">({salesStats.year.totalSales} transaksi)</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Sales Chart */}
      {!isLoading && salesStats && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Grafik Penjualan Bulanan</h3>
          <div className="h-64">
            <Line 
              data={getChartData() as any} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value: any) {
                        return 'Rp ' + value.toLocaleString();
                      }
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}
      
      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Filter Tanggal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-xs text-gray-500 mb-1">Tanggal Mulai</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red text-sm"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-xs text-gray-500 mb-1">Tanggal Akhir</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red text-sm"
            />
          </div>
        </div>
        <button
          onClick={handleDateFilterChange}
          className="mt-2 px-4 py-2 bg-kebab-red text-white rounded-md hover:bg-kebab-brown transition-colors text-sm"
        >
          Terapkan Filter
        </button>
      </div>
      
      {/* Sales Table */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kebab-red"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  No. Pesanan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{sale.orderNumber}</div>
                      <div className="text-xs text-gray-500">{sale.orderType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {sale.customer ? (
                        <div>
                          <div className="text-sm font-medium text-gray-900">{sale.customer.name}</div>
                          <div className="text-xs text-gray-500">{sale.customer.phone}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Pelanggan Umum</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">Rp {sale.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{sale.items.length} item</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sale.paymentStatus)}`}>
                          {sale.paymentStatus}
                        </span>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sale.orderStatus)}`}>
                          {sale.orderStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(sale.createdAt).toLocaleDateString('id-ID')}
                      <div className="text-xs">
                        {new Date(sale.createdAt).toLocaleTimeString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(sale)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(sale._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data penjualan yang tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Sale Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? `Edit Penjualan #${currentSale.orderNumber}` : 'Tambah Penjualan Baru'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Penjualan
                  </label>
                  <p className="text-sm text-gray-600">{currentSale.orderNumber || 'Akan dibuat otomatis'}</p>
                  <div>
                    <label htmlFor="customer" className="block text-sm font-medium text-gray-700 mb-1">
                      Pelanggan
                    </label>
                    <select
                      id="customer"
                      name="customer"
                      value={currentSale.customer?._id || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                    >
                      <option value="">Pelanggan Umum</option>
                      {customers.map(customer => (
                        <option key={customer._id} value={customer._id}>
                          {customer.name} - {customer.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="employee" className="block text-sm font-medium text-gray-700 mb-1">
                      Pegawai
                    </label>
                    <select
                      id="employee"
                      name="employee"
                      value={currentSale.employee?._id || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                    >
                      <option value="">Pilih Pegawai</option>
                      {employees.map(employee => (
                        <option key={employee._id} value={employee._id}>
                          {employee.name} - {employee.position}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="orderType" className="block text-sm font-medium text-gray-700 mb-1">
                      Tipe Pesanan
                    </label>
                    <select
                      id="orderType"
                      name="orderType"
                      value={currentSale.orderType}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                    >
                      <option value="Dine-in">Dine-in</option>
                      <option value="Take Away">Take Away</option>
                      <option value="Delivery">Delivery</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
                      Metode Pembayaran
                    </label>
                    <select
                      id="paymentMethod"
                      name="paymentMethod"
                      value={currentSale.paymentMethod}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                    >
                      <option value="Tunai">Tunai</option>
                      <option value="Kartu Kredit">Kartu Kredit</option>
                      <option value="Kartu Debit">Kartu Debit</option>
                      <option value="Transfer Bank">Transfer Bank</option>
                      <option value="E-Wallet">E-Wallet</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-1">
                      Status Pembayaran
                    </label>
                    <select
                      id="paymentStatus"
                      name="paymentStatus"
                      value={currentSale.paymentStatus}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                    >
                      <option value="Belum Dibayar">Belum Dibayar</option>
                      <option value="Dibayar">Dibayar</option>
                      <option value="Dibatalkan">Dibatalkan</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-1">
                    Status Pesanan
                  </label>
                  <select
                    id="orderStatus"
                    name="orderStatus"
                    value={currentSale.orderStatus}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                  >
                    <option value="Baru">Baru</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Siap">Siap</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={currentSale.notes || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                  />
                </div>
                
                {/* Items Section */}
                <div className="border-t border-b py-4 mb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-4">Item Pesanan</h4>
                  
                  {/* Add New Item */}
                  <div className="grid grid-cols-12 gap-2 mb-4">
                    <div className="col-span-7">
                      <select
                        name="product"
                        value={newItem.product}
                        onChange={handleNewItemChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                      >
                        <option value="">Pilih Produk</option>
                        {products.map(product => (
                          <option key={product._id} value={product._id}>
                            {product.name} - Rp {product.price.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3">
                      <input
                        type="number"
                        name="quantity"
                        value={newItem.quantity}
                        onChange={handleNewItemChange}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                      />
                    </div>
                    <div className="col-span-2">
                      <button
                        type="button"
                        onClick={handleAddItem}
                        className="w-full h-full bg-kebab-red text-white rounded-md hover:bg-kebab-brown transition-colors"
                      >
                        Tambah
                      </button>
                    </div>
                  </div>
                  
                  {/* Items List */}
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Produk
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Harga
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Jumlah
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subtotal
                          </th>
                          <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentSale.items && currentSale.items.length > 0 ? (
                          currentSale.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                {item.name}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                Rp {item.price.toLocaleString()}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                Rp {(item.price * item.quantity).toLocaleString()}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Hapus
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-4 py-2 text-center text-sm text-gray-500">
                              Belum ada item
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-gray-100">
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-right text-sm font-medium text-gray-900">
                            Total:
                          </td>
                          <td colSpan={2} className="px-4 py-2 text-left text-sm font-bold text-gray-900">
                            Rp {currentSale.totalAmount?.toLocaleString() || '0'}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg sticky bottom-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kebab-red"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-kebab-red hover:bg-kebab-brown focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kebab-red"
                >
                  {isEditing ? 'Simpan Perubahan' : 'Tambah Penjualan'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default SalesPage;

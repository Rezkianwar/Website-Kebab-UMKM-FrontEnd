import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; // Pastikan ini sudah diimport

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  notes?: string;
  createdAt: string;
}

const CustomersPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentCustomer, setCurrentCustomer] = useState<Partial<Customer>>({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  // Fetch customers
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get('/customers');
        console.log('Customers fetched:', res.data); // Untuk debugging
        setCustomers(res.data.data);
      } catch (err: any) {
        console.error('Error fetching customers:', err.response?.data || err.message);
        toast.error('Gagal memuat data pelanggan!', { duration: 3000 });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCustomers();
    }
  }, [isAuthenticated, loading, navigate]);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentCustomer({
      ...currentCustomer,
      [name]: value
    });
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Menggunakan toast.loading untuk indikator saat submit
    const submitToastId = toast.loading(isEditing ? 'Menyimpan perubahan pelanggan...' : 'Menambahkan pelanggan baru...');
    setIsLoading(true); // Set loading state untuk menonaktifkan tombol submit

    try {
      if (isEditing) {
        await apiClient.put(`/customers/${currentCustomer._id}`, currentCustomer);
        setCustomers(customers.map(customer =>
          customer._id === currentCustomer._id ? { ...customer, ...currentCustomer } as Customer : customer
        ));
        toast.success('Data pelanggan berhasil diperbarui!', { id: submitToastId });
      } else {
        const res = await apiClient.post('/customers', currentCustomer);
        setCustomers([...customers, res.data.data]);
        toast.success('Pelanggan baru berhasil ditambahkan!', { id: submitToastId });
      }

      // Tutup modal dan reset form setelah sukses
      setIsModalOpen(false);
      setCurrentCustomer({
        name: '',
        email: '',
        phone: '',
        address: '',
        notes: ''
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error saving customer:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || (isEditing ? 'Gagal menyimpan perubahan pelanggan.' : 'Gagal menambahkan pelanggan baru.');
      toast.error(errorMessage, { id: submitToastId });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Handle delete customer dengan konfirmasi toast kustom
  const handleDelete = (id: string, customerName: string) => {
    toast((t) => (
      <div className="flex flex-col items-center p-2">
        <p className="text-gray-800 text-center mb-3">
          Apakah Anda yakin ingin menghapus data pelanggan **{customerName}**?
          <br/>Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-2 w-full justify-center">
          <button
            onClick={() => {
              toast.dismiss(t.id); // Tutup toast konfirmasi
              performDelete(id); // Lanjutkan dengan penghapusan
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
          >
            Ya, Hapus!
          </button>
          <button
            onClick={() => toast.dismiss(t.id)} // Tutup toast konfirmasi
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors text-sm"
          >
            Batal
          </button>
        </div>
      </div>
    ), {
      duration: Infinity, // Toast akan tetap terbuka sampai diklik
      position: 'top-center',
      icon: '⚠️', // Opsional: Tambahkan ikon peringatan
      style: {
        maxWidth: '400px', // Atur lebar toast
        padding: '16px',
        borderRadius: '8px',
        background: '#fff',
        color: '#333',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      },
    });
  };

  // Fungsi terpisah untuk melakukan penghapusan sebenarnya (setelah dikonfirmasi)
  const performDelete = async (id: string) => {
    toast.promise(
      apiClient.delete(`/customers/${id}`),
      {
        loading: 'Menghapus data pelanggan...',
        success: () => {
          setCustomers(customers.filter(customer => customer._id !== id));
          return 'Data pelanggan berhasil dihapus!';
        },
        error: (err) => {
          console.error('Error deleting customer:', err.response?.data || err.message);
          return err.response?.data?.error || 'Gagal menghapus data pelanggan!';
        },
      }
    );
  };

  // Handle modal open for editing customer
  const handleEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle modal open for adding new customer
  const handleAdd = () => {
    setCurrentCustomer({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pelanggan</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="bg-kebab-red hover:bg-kebab-brown text-white px-4 py-2 rounded-lg transition-colors"
        >
          Tambah Pelanggan
        </motion.button>
      </div>

      {isLoading && customers.length === 0 ? ( // Menampilkan loading spinner hanya jika belum ada data
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kebab-red"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pelanggan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bergabung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Pesanan
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {customers.length > 0 ? (
                customers.map((customer) => (
                  <tr key={customer._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-kebab-green/20 flex items-center justify-center text-xs">
                          {customer.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{customer.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.email}</div>
                      <div className="text-sm text-gray-500">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(customer.joinDate || customer.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.totalOrders || 0} pesanan</div>
                      <div className="text-sm text-gray-500">Rp {(customer.totalSpent || 0).toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer._id, customer.name)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Tidak ada data pelanggan yang tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Customer Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Edit Data Pelanggan' : 'Tambah Pelanggan Baru'}
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pelanggan
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentCustomer.name || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={currentCustomer.email || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Telepon
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={currentCustomer.phone || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Alamat
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={currentCustomer.address || ''}
                    onChange={handleChange}
                    required
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Catatan (Opsional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={currentCustomer.notes || ''}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                  />
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kebab-red"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading} // Menonaktifkan tombol saat loading
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-kebab-red hover:bg-kebab-brown focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kebab-red"
                >
                  {isLoading ? 'Memproses...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Pelanggan')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
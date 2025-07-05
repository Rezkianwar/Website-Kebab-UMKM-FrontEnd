import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../utils/axiosConfig';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'; // Import react-hot-toast

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  salary: number;
  joinDate: string;
  address: string;
  status: 'Aktif' | 'Cuti' | 'Tidak Aktif';
  notes?: string;
  createdAt: string;
}

const EmployeesPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string>(''); // Tidak lagi diperlukan karena toast akan menangani error

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentEmployee, setCurrentEmployee] = useState<Partial<Employee>>({
    name: '',
    email: '',
    phone: '',
    position: 'Kasir',
    salary: 0,
    address: '',
    status: 'Aktif',
    notes: ''
  });

  // Fetch employees
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get('/employees'); // API Path: /employees
        setEmployees(res.data.data);
        // setError(''); // Tidak lagi diperlukan
      } catch (err: any) {
        toast.error('Gagal memuat data pegawai!', { duration: 3000 }); // Notifikasi error
        console.error('Error fetching employees:', err.response?.data || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchEmployees();
    }
  }, [isAuthenticated, loading, navigate]);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setCurrentEmployee({
        ...currentEmployee,
        [name]: parseFloat(value)
      });
    } else {
      setCurrentEmployee({
        ...currentEmployee,
        [name]: value
      });
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitToastId = toast.loading(isEditing ? 'Menyimpan perubahan pegawai...' : 'Menambahkan pegawai baru...');
    setIsLoading(true); // Set loading state for the form submission

    try {
      if (isEditing) {
        await apiClient.put(`/employees/${currentEmployee._id}`, currentEmployee); // API Path: /employees/:id
        setEmployees(employees.map(employee =>
          employee._id === currentEmployee._id ? { ...employee, ...currentEmployee } as Employee : employee
        ));
        toast.success('Data pegawai berhasil diperbarui!', { id: submitToastId });
      } else {
        const res = await apiClient.post('/employees', currentEmployee); // API Path: /employees
        setEmployees([...employees, res.data.data]);
        toast.success('Pegawai baru berhasil ditambahkan!', { id: submitToastId });
      }

      // Close modal and reset form
      setIsModalOpen(false);
      setCurrentEmployee({
        name: '',
        email: '',
        phone: '',
        position: 'Kasir',
        salary: 0,
        address: '',
        status: 'Aktif',
        notes: ''
      });
      setIsEditing(false);
    } catch (err: any) {
      console.error('Error saving employee:', err.response?.data || err.message);
      const errorMessage = err.response?.data?.error || (isEditing ? 'Gagal menyimpan perubahan pegawai.' : 'Gagal menambahkan pegawai baru.');
      toast.error(errorMessage, { id: submitToastId });
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  // Handle delete employee dengan konfirmasi toast kustom
  const handleDelete = (id: string, employeeName: string) => { // Menerima employeeName
    toast((t) => (
      <div className="flex flex-col items-center p-2">
        <p className="text-gray-800 text-center mb-3">
          Apakah Anda yakin ingin menghapus data pegawai **{employeeName}**?
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

  // Fungsi terpisah untuk melakukan penghapusan sebenarnya
  const performDelete = async (id: string) => {
    toast.promise(
      apiClient.delete(`/employees/${id}`), // API Path: /employees/:id
      {
        loading: 'Menghapus data pegawai...',
        success: () => {
          setEmployees(employees.filter(employee => employee._id !== id));
          return 'Data pegawai berhasil dihapus!';
        },
        error: (err) => {
          console.error('Error deleting employee:', err.response?.data || err.message);
          return err.response?.data?.error || 'Gagal menghapus data pegawai!';
        },
      }
    );
  };

  // Handle modal open for editing employee
  const handleEdit = (employee: Employee) => {
    setCurrentEmployee(employee);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Handle modal open for adding new employee
  const handleAdd = () => {
    setCurrentEmployee({
      name: '',
      email: '',
      phone: '',
      position: 'Kasir',
      salary: 0,
      address: '',
      status: 'Aktif',
      notes: ''
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-100 text-green-800';
      case 'Cuti':
        return 'bg-yellow-100 text-yellow-800';
      case 'Tidak Aktif':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Pegawai</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="bg-kebab-red hover:bg-kebab-brown text-white px-4 py-2 rounded-lg transition-colors"
        >
          Tambah Pegawai
        </motion.button>
      </div>

      {isLoading && employees.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kebab-red"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pegawai
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Posisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <tr key={employee._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-kebab-brown/20 flex items-center justify-center text-xs">
                          {employee.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">Bergabung: {new Date(employee.joinDate || employee.createdAt).toLocaleDateString('id-ID')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.position}</div>
                      <div className="text-sm text-gray-500">Rp {employee.salary.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{employee.email}</div>
                      <div className="text-sm text-gray-500">{employee.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(employee)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(employee._id, employee.name)}
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
                    Tidak ada data pegawai yang tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Employee Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Edit Data Pegawai' : 'Tambah Pegawai Baru'}
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Pegawai
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentEmployee.name || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                      Posisi
                    </label>
                    <select
                      id="position"
                      name="position"
                      value={currentEmployee.position || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                    >
                      <option value="Manager">Manager</option>
                      <option value="Kasir">Kasir</option>
                      <option value="Chef">Chef</option>
                      <option value="Pelayan">Pelayan</option>
                      <option value="Kurir">Kurir</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={currentEmployee.status || ''}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                    >
                      <option value="Aktif">Aktif</option>
                      <option value="Cuti">Cuti</option>
                      <option value="Tidak Aktif">Tidak Aktif</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700 mb-1">
                    Gaji
                  </label>
                  <input
                    type="number"
                    id="salary"
                    name="salary"
                    value={currentEmployee.salary || 0}
                    onChange={handleChange}
                    required
                    min="0"
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
                    value={currentEmployee.email || ''}
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
                    value={currentEmployee.phone || ''}
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
                    value={currentEmployee.address || ''}
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
                    value={currentEmployee.notes || ''}
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
                  disabled={isLoading}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-kebab-red hover:bg-kebab-brown focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kebab-red"
                >
                  {isLoading ? 'Memproses...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Pegawai')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default EmployeesPage;
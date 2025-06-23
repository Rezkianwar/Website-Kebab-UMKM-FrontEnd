import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiClient from '../utils/axiosConfig'; // Gunakan apiClient yang sudah dikonfigurasi
import { useAuth } from '../context/AuthContext';



interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  imageUrl: string;
  imagePublicId?: string | null; // Sudah benar
  isAvailable: boolean;
  createdAt: string;
}

// Define interface for API response data for product operations
interface ApiResponseData {
    data: Product; // Assuming single product for create/update
    // You might also have a `success` boolean or `message` string
}

const ProductsPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: 'Kebab Daging',
    isAvailable: true,
    imageUrl: 'no-image.jpg',
    imagePublicId: null,
  });

  // State untuk upload gambar
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Fetch products on mount
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await apiClient.get('/products');
        console.log('Products fetched:', res.data);
        setProducts(res.data.data || []);
        setError('');
      } catch (err: any) {
        console.error('Error fetching products:', err.response?.data || err.message);
        setError('Gagal memuat data produk');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, loading, navigate]);

    // Handle form input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setCurrentProduct({
        ...currentProduct,
        [name]: target.checked,
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        [name]: value,
      });
    }
  };

  // Handle file input change
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setUploadError(null); // Reset upload error

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      // Jika tidak ada file baru dipilih, kembali ke gambar produk saat ini (jika ada)
      // Mengatasi `Type 'undefined' is not assignable to type 'SetStateAction<string | null>'`
      // Pastikan `currentProduct.imageUrl` selalu string atau 'no-image.jpg'
      setPreviewUrl(currentProduct.imageUrl && currentProduct.imageUrl !== 'no-image.jpg' ? currentProduct.imageUrl : null);
    }
  };


  // Handle form submit (Create/Update Product)
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setUploadingImage(true); // Reset status upload gambar
    setUploadError(null); // Reset error upload gambar
    setError(''); // Reset error umum
    setIsLoading(true); // Untuk menonaktifkan tombol form

    // Hapus deklarasi finalImageUrl dan finalImagePublicId
    // let finalImageUrl = currentProduct.imageUrl;
    // let finalImagePublicId = currentProduct.imagePublicId;

    // Langkah 1: Kirim FormData untuk Create/Update (semua dalam satu request)
    const formData = new FormData();

    // Append semua field produk non-file
    // Pastikan nilai diubah ke string karena FormData mengirim semua sebagai string
    formData.append('name', currentProduct.name || '');
    formData.append('description', currentProduct.description || '');
    formData.append('price', String(currentProduct.price || 0));
    formData.append('discountPrice', String(currentProduct.discountPrice || 0));
    formData.append('category', currentProduct.category || 'Lainnya');
    formData.append('isAvailable', String(!!currentProduct.isAvailable));

    // Handle file upload
    if (selectedFile) {
      formData.append('imageUrl', selectedFile); // 'imageUrl' harus sesuai dengan nama field di Multer backend
    } else if (isEditing && currentProduct.imageUrl === 'no-image.jpg' && products.find(p => p._id === currentProduct._id)?.imageUrl !== 'no-image.jpg') {
        // Ini adalah skenario ketika pengguna mengedit, dan sebelumnya ada gambar,
        // lalu pengguna menghapus gambar tanpa mengunggah yang baru (yaitu, `previewUrl` menjadi null,
        // dan `currentProduct.imageUrl` sudah diset ke 'no-image.jpg' di handleFileChange atau saat reset form)
        // Kita perlu mengirim sinyal ke backend bahwa gambar harus dihapus.
        // Berdasarkan controller backend yang saya berikan, mengirim `imageUrl: 'no-image.jpg'` (tanpa file baru)
        // akan memicu penghapusan gambar lama di Cloudinary jika ada.
        formData.append('imageUrl', 'no-image.jpg');
    } else {
        // Jika tidak ada file baru DAN tidak ada indikasi hapus gambar,
        // kirim kembali imageUrl dan imagePublicId yang sudah ada.
        // Ini penting agar gambar tidak hilang jika hanya field lain yang diupdate.
        formData.append('imageUrl', currentProduct.imageUrl || 'no-image.jpg');
        if (currentProduct.imagePublicId) {
            formData.append('imagePublicId', currentProduct.imagePublicId);
        }
    }


    // Ambil token dari localStorage untuk otorisasi
    const token = localStorage.getItem('token');
    const config = {
        headers: {
            'Content-Type': 'multipart/form-data', // Penting untuk FormData
            'Authorization': token ? `Bearer ${token}` : '', // Tambahkan token jika ada
        },
    };

    try {
      // Perbaiki error `res` implicitly has type `any`
      let res: { data: { data: Product } }; // Definisikan tipe untuk res

      if (isEditing) {
        // Untuk UPDATE
        res = await apiClient.put<ApiResponseData>(`/products/${currentProduct._id}`, formData, config);
        setProducts(
          products.map((product) =>
            product._id === currentProduct._id
              ? { ...product, ...res.data.data }
              : product
          )
        );
      } else {
        // Untuk CREATE
        res = await apiClient.post<ApiResponseData>('/products', formData, config);
        setProducts([...products, res.data.data]);
      }

      // Close modal and reset form
      setIsModalOpen(false);
      setCurrentProduct({
        name: '',
        description: '',
        price: 0,
        category: 'Kebab Daging',
        isAvailable: true,
        imageUrl: 'no-image.jpg', // Reset ke default
        imagePublicId: null,      // Reset ke default
      });
      setIsEditing(false);
      setSelectedFile(null); // Reset file yang dipilih
      setPreviewUrl(null); // Reset preview gambar
    } catch (err: any) {
      console.error('Error saving product:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Gagal menyimpan produk');
      setUploadError(err.response?.data?.error || 'Gagal mengunggah gambar/menyimpan produk.');
    } finally {
       setUploadingImage(false);
      setIsLoading(false);
    }
  };

  // Handle delete product
  const handleDelete = async (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await apiClient.delete(`/products/${id}`);
        setProducts(products.filter((product) => product._id !== id));
      } catch (err: any) {
        console.error('Error deleting product:', err.response?.data || err.message);
        setError(err.response?.data?.error || 'Gagal menghapus produk');
      }
    }
  };

  // Open edit modal
  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    // Set previewUrl ke imageUrl produk yang ada, jika bukan default 'no-image.jpg'
    setPreviewUrl(product.imageUrl === 'no-image.jpg' ? null : product.imageUrl);
    setSelectedFile(null); // Pastikan tidak ada file baru yang dipilih secara default
    setIsEditing(true);
    setIsModalOpen(true);
  };

  // Open add modal
  const handleAdd = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: 0,
      category: 'Kebab Daging',
      isAvailable: true,
      imageUrl: 'no-image.jpg', // Reset ke default
      imagePublicId: null,      // Reset ke default
    });
    setSelectedFile(null); // Reset file yang dipilih
    setPreviewUrl(null); // Reset preview gambar
    setIsEditing(false);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Produk</h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="bg-kebab-red hover:bg-kebab-brown text-white px-4 py-2 rounded-lg transition-colors"
        >
          Tambah Produk
        </motion.button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

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
                  Produk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga
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
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-kebab-yellow/20 flex items-center justify-center text-xs overflow-hidden">
                          {product.imageUrl && product.imageUrl !== 'no-image.jpg' ? (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            product.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-kebab-green/10 text-kebab-green">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      Rp {product.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.isAvailable
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {product.isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
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
                    Tidak ada produk yang tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={currentProduct.name || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={currentProduct.description || ''}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                      Harga
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={currentProduct.price || 0}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Kategori
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={currentProduct.category || 'Kebab Daging'}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                    >
                      <option value="Kebab Daging">Kebab Daging</option>
                      <option value="Kebab Ayam">Kebab Ayam</option>
                      <option value="Kebab Vegetarian">Kebab Vegetarian</option>
                      <option value="Kebab Jumbo Mix">Kebab Jumbo Mix</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Paket Hemat">Paket Hemat</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                </div>

                {/* Input untuk Gambar Produk */}
                <div className="mb-4">
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Gambar Produk
                  </label>
                  <input
                    type="file"
                    id="imageUrl"
                    name="imageUrl"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-kebab-red focus:border-kebab-red"
                  />
                  {(previewUrl || (currentProduct.imageUrl && currentProduct.imageUrl !== 'no-image.jpg')) && (
                    <div className="mt-2">
                      <img
                        src={previewUrl || currentProduct.imageUrl || ''}
                        alt="Preview"
                        className="max-h-32 max-w-full rounded-md object-cover"
                      />
                    </div>
                  )}
                  {/* Tombol untuk menghapus gambar jika sedang edit dan ada gambar */}
                  {isEditing && currentProduct.imageUrl && currentProduct.imageUrl !== 'no-image.jpg' && !selectedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null); // Pastikan tidak ada file baru
                        setPreviewUrl(null); // Hapus preview
                        setCurrentProduct(prev => ({ ...prev, imageUrl: 'no-image.jpg', imagePublicId: null })); // Set ke default
                      }}
                      className="mt-2 text-red-600 hover:text-red-800 text-sm"
                    >
                      Hapus Gambar Saat Ini
                    </button>
                  )}
                    {/* START: Code untuk Animasi Loading Gambar */}
                  {uploadingImage && (
                    <div className="flex items-center mt-2 text-kebab-green">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-kebab-green mr-2"></div>
                      <span>Mengunggah gambar...</span>
                    </div>
                  )}
                  {/* END: Code untuk Animasi Loading Gambar */}

                  {!uploadingImage && uploadError && <p className="text-red-500 text-sm mt-1">{uploadError}</p>}
                </div>


                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={!!currentProduct.isAvailable}
                    onChange={(e) =>
                      setCurrentProduct({ ...currentProduct, isAvailable: e.target.checked })
                    }
                    className="h-4 w-4 text-kebab-red focus:ring-kebab-red border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isAvailable"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Produk tersedia
                  </label>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 flex justify-end space-x-3 rounded-b-lg">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedFile(null); // Reset file saat batal
                    setPreviewUrl(null); // Reset preview saat batal
                    setUploadError(null); // Reset error
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kebab-red"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading || uploadingImage} // Tombol dinonaktifkan jika sedang loading atau mengunggah gambar
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-kebab-red hover:bg-kebab-brown focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-kebab-red"
                >
                  {/* START: Teks tombol berubah berdasarkan status loading/upload */}
                  {isLoading ? 'Memproses...' : (uploadingImage ? 'Mengunggah...' : (isEditing ? 'Simpan Perubahan' : 'Tambah Produk'))}
                  {/* END: Teks tombol berubah berdasarkan status loading/upload */}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
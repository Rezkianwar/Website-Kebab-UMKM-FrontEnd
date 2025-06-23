import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../utils/axiosConfig'; // Pastikan file ini sudah ada

interface AuthContextType {
  isAuthenticated: boolean;
  user: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Cek apakah token tersedia saat load aplikasi
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
           console.log("Axios headers:", apiClient.defaults.headers.common);
          const res = await apiClient.get('/auth/me');
          
          setUser(res.data.data);
          setIsAuthenticated(true);
        } catch (err: any) {
          console.error('Token tidak valid:', err);
          localStorage.removeItem('token');
          delete apiClient.defaults.headers.common['Authorization'];
          
          setIsAuthenticated(false);
          setUser(null);
        }
      }

      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  // Set token secara global untuk Axios
  // const setAuthToken = (token: string | null) => {
  //   if (token) {
  //     apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //   } else {
  //     delete apiClient.defaults.headers.common['Authorization'];
  //   }
  // };

  // Login function
const login = async (email: string, password: string): Promise<void> => {
  try {
    const res = await apiClient.post("/auth/login", { email, password });
    const token = res.data.token;

    localStorage.setItem("token", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    const userRes = await apiClient.get("/auth/me");
    setUser(userRes.data.data);
    setIsAuthenticated(true);

    // 🔥 Tambahkan baris ini untuk navigasi otomatis ke dashboard
    navigate('/dashboard');

  } catch (err: any) {
    throw new Error(err.response?.data?.error || 'Login gagal');
  }
};

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
    
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook untuk pakai auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan dalam AuthProvider');
  }
  return context;
};